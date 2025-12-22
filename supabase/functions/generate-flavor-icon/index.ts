import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Flavor prompts for AI image generation
const flavorPrompts: Record<string, { label: string; prompt: string }> = {
  cherry: { label: "Anh đào", prompt: "A single ripe red cherry with stem, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  plum: { label: "Mận", prompt: "A single ripe purple plum, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  berry: { label: "Dâu", prompt: "Mixed red berries (strawberry, raspberry, blueberry), minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  blackberry: { label: "Dâu đen", prompt: "A cluster of dark purple blackberries, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  raspberry: { label: "Mâm xôi", prompt: "A single ripe pink-red raspberry, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  strawberry: { label: "Dâu tây", prompt: "A single ripe red strawberry with green leaves, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  citrus: { label: "Cam quýt", prompt: "A fresh orange citrus slice showing segments, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  lemon: { label: "Chanh", prompt: "A fresh yellow lemon slice, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  apple: { label: "Táo", prompt: "A single green apple with leaf, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  pear: { label: "Lê", prompt: "A single yellow-green pear with stem, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  peach: { label: "Đào", prompt: "A single ripe peach with soft orange-pink color, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  tropical: { label: "Nhiệt đới", prompt: "Tropical fruits arrangement (pineapple, mango, passion fruit), minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  fig: { label: "Sung", prompt: "A ripe purple fig cut in half showing red interior, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  raisin: { label: "Nho khô", prompt: "A small cluster of dried raisins, dark brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  floral: { label: "Hoa", prompt: "A delicate white flower bloom, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  rose: { label: "Hoa hồng", prompt: "A single elegant pink rose bloom, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  herb: { label: "Thảo mộc", prompt: "Fresh green herbs (rosemary, thyme sprigs), minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  mint: { label: "Bạc hà", prompt: "Fresh green mint leaves, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  spice: { label: "Gia vị", prompt: "Warm spices (cinnamon stick, star anise, cloves), minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  pepper: { label: "Tiêu", prompt: "Black peppercorns scattered, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  licorice: { label: "Cam thảo", prompt: "Licorice root pieces, brown woody, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  mineral: { label: "Khoáng chất", prompt: "Smooth grey river stones, mineral, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  oak: { label: "Gỗ sồi", prompt: "Oak wood barrel texture with grain, brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  earth: { label: "Đất", prompt: "Rich brown earth soil texture, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  tobacco: { label: "Thuốc lá", prompt: "Dried tobacco leaves, amber brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  leather: { label: "Da thuộc", prompt: "Elegant leather texture, rich brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  smoke: { label: "Khói", prompt: "Wisps of grey smoke rising, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  vanilla: { label: "Vani", prompt: "Vanilla bean pods, cream brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  chocolate: { label: "Chocolate", prompt: "Dark chocolate pieces broken, rich brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  coffee: { label: "Cà phê", prompt: "Roasted coffee beans, dark brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  honey: { label: "Mật ong", prompt: "Golden honey dripping from dipper, amber, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  butter: { label: "Bơ", prompt: "Creamy butter curl, pale yellow, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  cream: { label: "Kem", prompt: "Swirl of white cream, soft, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  almond: { label: "Hạnh nhân", prompt: "Almonds whole and halved, light brown, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
  caramel: { label: "Caramel", prompt: "Caramel sauce drizzle, golden amber, minimalist wine tasting icon style, soft watercolor, elegant, white background" },
};

// Valid flavor IDs for validation
const validFlavorIds = Object.keys(flavorPrompts);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ===== AUTHENTICATION CHECK =====
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase configuration');
      throw new Error('Server configuration error');
    }

    if (!LOVABLE_API_KEY) {
      console.error('Missing LOVABLE_API_KEY');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Supabase client with user's auth token
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      console.error('Auth error:', authError?.message || 'No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin role
    const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin');
    
    if (roleError) {
      console.error('Role check error:', roleError.message);
      return new Response(JSON.stringify({ error: 'Authorization check failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!isAdmin) {
      console.error('User is not admin:', user.id);
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin user authenticated:', user.id);

    // ===== INPUT VALIDATION =====
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (typeof body !== 'object' || body === null) {
      return new Response(JSON.stringify({ error: 'Request body must be an object' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { flavorId, generateAll } = body as { flavorId?: unknown; generateAll?: unknown };

    // Validate flavorId type and format
    if (flavorId !== undefined) {
      if (typeof flavorId !== 'string') {
        return new Response(JSON.stringify({ error: 'flavorId must be a string' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (flavorId.length > 50) {
        return new Response(JSON.stringify({ error: 'flavorId is too long' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (!/^[a-z-]+$/.test(flavorId)) {
        return new Response(JSON.stringify({ error: 'flavorId must contain only lowercase letters and hyphens' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (!validFlavorIds.includes(flavorId)) {
        return new Response(JSON.stringify({ error: `Invalid flavorId. Must be one of: ${validFlavorIds.join(', ')}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Validate generateAll type
    if (generateAll !== undefined && typeof generateAll !== 'boolean') {
      return new Response(JSON.stringify({ error: 'generateAll must be a boolean' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Require at least one parameter
    if (!flavorId && !generateAll) {
      return new Response(JSON.stringify({ error: 'Either flavorId or generateAll must be provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ===== GENERATE ICONS =====
    const flavorsToGenerate = generateAll 
      ? validFlavorIds 
      : [flavorId as string];

    console.log(`Generating ${flavorsToGenerate.length} icon(s) for admin user ${user.id}`);

    const results: { flavorId: string; url: string; error?: string }[] = [];

    for (const id of flavorsToGenerate) {
      const flavor = flavorPrompts[id];

      try {
        console.log(`Generating icon for ${id}: ${flavor.label}`);
        
        // Call Lovable AI Gateway with image generation model
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: `Generate a 256x256 pixel icon: ${flavor.prompt}. Make it clean, simple, and elegant for a wine tasting app.`
              }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI API error for ${id}:`, aiResponse.status, errorText);
          results.push({ flavorId: id, url: '', error: `AI API error: ${aiResponse.status}` });
          continue;
        }

        const aiData = await aiResponse.json();
        console.log(`AI response for ${id}:`, JSON.stringify(aiData).slice(0, 200));
        
        const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!imageData) {
          console.error(`No image data received for ${id}`);
          results.push({ flavorId: id, url: '', error: 'No image generated' });
          continue;
        }

        // Extract base64 data (remove data:image/png;base64, prefix)
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Supabase Storage
        const fileName = `${id}.png`;
        const { error: uploadError } = await supabase.storage
          .from('flavor-icons')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${id}:`, uploadError);
          results.push({ flavorId: id, url: '', error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('flavor-icons')
          .getPublicUrl(fileName);

        console.log(`Successfully generated and uploaded icon for ${id}: ${urlData.publicUrl}`);
        results.push({ flavorId: id, url: urlData.publicUrl });

        // Add small delay between generations to avoid rate limiting
        if (generateAll && flavorsToGenerate.indexOf(id) < flavorsToGenerate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error generating icon for ${id}:`, error);
        results.push({ flavorId: id, url: '', error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-flavor-icon:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

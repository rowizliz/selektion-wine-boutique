import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Database, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminExportData = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const escapeSQL = (value: unknown): string => {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) {
      return `ARRAY[${value.map(v => `'${String(v).replace(/'/g, "''")}'`).join(", ")}]`;
    }
    return `'${String(value).replace(/'/g, "''")}'`;
  };

  const exportSQL = async () => {
    setLoading("sql");
    try {
      const [profilesRes, winesRes, inventoryRes] = await Promise.all([
        supabase.from("inventory_profiles").select("*"),
        supabase.from("wines").select("*"),
        supabase.from("inventory").select("*"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (winesRes.error) throw winesRes.error;
      if (inventoryRes.error) throw inventoryRes.error;

      let sql = "-- Export Data from Lovable Cloud\n";
      sql += `-- Generated: ${new Date().toISOString()}\n\n`;

      // inventory_profiles
      sql += "-- ==================== INVENTORY PROFILES ====================\n";
      for (const row of profilesRes.data || []) {
        const cols = Object.keys(row).join(", ");
        const vals = Object.values(row).map(escapeSQL).join(", ");
        sql += `INSERT INTO inventory_profiles (${cols}) VALUES (${vals});\n`;
      }

      // wines
      sql += "\n-- ==================== WINES ====================\n";
      for (const row of winesRes.data || []) {
        const cols = Object.keys(row).join(", ");
        const vals = Object.values(row).map(escapeSQL).join(", ");
        sql += `INSERT INTO wines (${cols}) VALUES (${vals});\n`;
      }

      // inventory
      sql += "\n-- ==================== INVENTORY ====================\n";
      for (const row of inventoryRes.data || []) {
        const cols = Object.keys(row).join(", ");
        const vals = Object.values(row).map(escapeSQL).join(", ");
        sql += `INSERT INTO inventory (${cols}) VALUES (${vals});\n`;
      }

      downloadFile(sql, "export-data.sql", "text/plain");
      toast({ title: "Exported SQL", description: `${(profilesRes.data?.length || 0) + (winesRes.data?.length || 0) + (inventoryRes.data?.length || 0)} records` });
    } catch (error) {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    }
    setLoading(null);
  };

  const arrayToCSV = (data: Record<string, unknown>[]) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        if (Array.isArray(val)) return `"${val.join(";")}"`;
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const exportCSV = async (table: "inventory_profiles" | "wines" | "inventory") => {
    setLoading(table);
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      const csv = arrayToCSV(data || []);
      downloadFile(csv, `${table}.csv`, "text/csv");
      toast({ title: "Exported CSV", description: `${data?.length || 0} records from ${table}` });
    } catch (error) {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Export Data | Admin</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Admin
          </Link>
          <h1 className="text-3xl font-bold">Export Data</h1>
          <p className="text-muted-foreground mt-2">Download data để migrate sang Supabase khác</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                SQL Export
              </CardTitle>
              <CardDescription>
                Tất cả data dưới dạng INSERT statements. Chạy trong SQL Editor của Supabase mới.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportSQL} disabled={loading === "sql"} className="w-full">
                {loading === "sql" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Download export-data.sql
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                CSV Export
              </CardTitle>
              <CardDescription>
                Export từng bảng riêng lẻ dưới dạng CSV.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" onClick={() => exportCSV("inventory_profiles")} disabled={loading === "inventory_profiles"} className="w-full justify-start">
                {loading === "inventory_profiles" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                inventory_profiles.csv
              </Button>
              <Button variant="outline" onClick={() => exportCSV("wines")} disabled={loading === "wines"} className="w-full justify-start">
                {loading === "wines" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                wines.csv
              </Button>
              <Button variant="outline" onClick={() => exportCSV("inventory")} disabled={loading === "inventory"} className="w-full justify-start">
                {loading === "inventory" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                inventory.csv
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hướng dẫn Import</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <ol className="list-decimal pl-4 space-y-2 text-muted-foreground">
              <li>Tạo tables trong Supabase mới (copy schema từ project này)</li>
              <li>Mở <strong>SQL Editor</strong> trong Supabase Dashboard</li>
              <li>Paste nội dung file <code>export-data.sql</code> và chạy</li>
              <li>Hoặc dùng <strong>Table Editor → Import CSV</strong> cho từng bảng</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminExportData;

import { BlogCategory } from "@/hooks/useBlogCategories";

interface BlogCategoryTabsProps {
  categories: BlogCategory[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

const BlogCategoryTabs = ({ categories, activeCategory, onCategoryChange }: BlogCategoryTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 text-xs font-sans tracking-widest uppercase transition-colors ${
          activeCategory === null
            ? "bg-foreground text-background"
            : "bg-muted text-foreground hover:bg-muted-foreground/10"
        }`}
      >
        Tất Cả
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.slug)}
          className={`px-4 py-2 text-xs font-sans tracking-widest uppercase transition-colors ${
            activeCategory === category.slug
              ? "bg-foreground text-background"
              : "bg-muted text-foreground hover:bg-muted-foreground/10"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default BlogCategoryTabs;

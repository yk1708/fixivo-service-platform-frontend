import { Link } from 'react-router';

export function CategoryCard({ icon, title, description, count, color, bgColor, slug }) {
  return (
    <Link
      to={`/services/${slug}`}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer block"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: bgColor, color }}
      >
        {icon}
      </div>
      <h3 className="text-gray-900 text-base mb-1.5" style={{ fontWeight: 700 }}>{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed mb-3">{description}</p>
      <div className="flex items-center gap-1.5">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: bgColor, color, fontWeight: 600 }}
        >
          {count} professionals
        </span>
      </div>
    </Link>
  );
}
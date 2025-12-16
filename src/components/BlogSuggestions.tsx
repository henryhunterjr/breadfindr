import { useMemo } from 'react';
import { BookOpen, ChefHat, ExternalLink } from 'lucide-react';
import { getMatchingPosts, getFeaturedPost, type BlogPost } from '../data/blogContent';

interface BlogSuggestionsProps {
  searchTerms?: string[];
  specialties?: string[];
  variant?: 'inline' | 'banner' | 'sidebar';
}

export default function BlogSuggestions({
  searchTerms = [],
  specialties = [],
  variant = 'inline'
}: BlogSuggestionsProps) {
  const posts = useMemo(() => {
    const allTerms = [...searchTerms, ...specialties];

    if (allTerms.length > 0) {
      return getMatchingPosts(allTerms, variant === 'banner' ? 1 : 2);
    }

    // No search - show featured post for banner, random for others
    if (variant === 'banner') {
      return [getFeaturedPost()];
    }
    return getMatchingPosts([], 2);
  }, [searchTerms, specialties, variant]);

  if (posts.length === 0) return null;

  // Banner variant - single featured post
  if (variant === 'banner') {
    const post = posts[0];
    return (
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            {post.type === 'recipe' ? (
              <ChefHat className="w-5 h-5 text-amber-600" />
            ) : (
              <BookOpen className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                {post.type === 'recipe' ? 'Try This Recipe' : 'From the Blog'}
              </span>
            </div>
            <h4 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors mt-0.5">
              {post.title}
            </h4>
            <p className="text-sm text-stone-600 line-clamp-2 mt-0.5">
              {post.description}
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-amber-600 flex-shrink-0 mt-1" />
        </div>
      </a>
    );
  }

  // Inline variant - shows in the list
  if (variant === 'inline') {
    return (
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <ChefHat className="w-4 h-4" />
          {searchTerms.length > 0 || specialties.length > 0
            ? 'Related Recipes & Tips'
            : 'Bake Your Own'}
        </h4>
        <div className="space-y-2">
          {posts.map(post => (
            <PostCard key={post.id} post={post} compact />
          ))}
        </div>
        <a
          href="https://bakinggreatbread.com/recipes"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
        >
          Browse all recipes
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-amber-600" />
        From the Blog
      </h4>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white rounded-lg border border-stone-200 hover:border-amber-300 hover:shadow-sm transition-all group ${
        compact ? 'p-2.5' : 'p-3'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className={`flex-shrink-0 ${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-amber-50 rounded-lg flex items-center justify-center`}>
          {post.type === 'recipe' ? (
            <ChefHat className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-amber-500`} />
          ) : (
            <BookOpen className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-amber-500`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className={`font-medium text-stone-800 group-hover:text-amber-700 transition-colors ${
            compact ? 'text-sm' : ''
          }`}>
            {post.title}
          </h5>
          {!compact && (
            <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
              {post.description}
            </p>
          )}
        </div>
        <ExternalLink className="w-3 h-3 text-stone-300 group-hover:text-amber-500 flex-shrink-0" />
      </div>
    </a>
  );
}

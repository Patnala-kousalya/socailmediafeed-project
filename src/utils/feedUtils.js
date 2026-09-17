export const transformPost = (rawPost) => {
  const baseLikeCount = ((rawPost.id * 17 + rawPost.userId * 13) % 240) + 12;
  const createdAt = new Date(Date.now() - (rawPost.id * 3600000 + rawPost.userId * 300000)).toISOString();

  return {
    ...rawPost,
    likeCount: baseLikeCount,
    isLiked: false,
    hashtags: ['#react', '#frontend', `#post${rawPost.id}`],
    createdAt,
  };
};

export const sortPosts = (posts, sortType) => {
  const nextPosts = posts.slice();

  switch (sortType) {
    case 'popular':
      return nextPosts.sort((a, b) => b.likeCount - a.likeCount);
    case 'recent':
      return nextPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'all':
    default:
      return nextPosts;
  }
};

export const getHashtagSuggestions = (posts, searchTerm) => {
  const normalized = (searchTerm || '').trim().toLowerCase();

  const allHashtags = posts.flatMap((post) => post.hashtags || []);
  const unique = [...new Set(allHashtags)];

  if (!normalized) {
    return unique.slice(0, 8);
  }

  return unique.filter((tag) => tag.toLowerCase().includes(normalized)).slice(0, 8);
};

export const matchesSearch = (post, searchTerm) => {
  const normalized = (searchTerm || '').trim().toLowerCase();

  if (!normalized) return true;

  const haystack = [
    post.title,
    post.body,
    ...(post.hashtags || []),
    `#post${post.id}`,
    `${post.userId}`,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
};

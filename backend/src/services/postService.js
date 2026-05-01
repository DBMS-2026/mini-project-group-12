const { Post, User, Like, Comment, SavedPost } = require('../models');

const createPost = async (postData) => {
  const post = await Post.create(postData);
  const fullPost = await Post.findByPk(post.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] }],
  });
  return fullPost;
};

const getAllPosts = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const { rows: posts, count } = await Post.findAndCountAll({
    where: { type: 'post' },
    include: [
      { model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] },
      { model: Like, as: 'likes', attributes: ['userId'] },
      { model: Comment, as: 'comments', attributes: ['id'] },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return { posts, total: count, page, totalPages: Math.ceil(count / limit) };
};

const getReels = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const { rows: reels, count } = await Post.findAndCountAll({
    where: { type: 'reel' },
    include: [
      { model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] },
      { model: Like, as: 'likes', attributes: ['userId'] },
      { model: Comment, as: 'comments', attributes: ['id'] },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return { reels, total: count, page, totalPages: Math.ceil(count / limit) };
};

const getPostById = async (id) => {
  const post = await Post.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] },
      { model: Like, as: 'likes', attributes: ['userId'] },
      {
        model: Comment,
        as: 'comments',
        include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] }],
        order: [['createdAt', 'DESC']],
      },
    ],
  });
  return post;
};

const getUserPosts = async (username) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('User not found');

  const posts = await Post.findAll({
    where: { userId: user.id },
    include: [
      { model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] },
      { model: Like, as: 'likes', attributes: ['userId'] },
      { model: Comment, as: 'comments', attributes: ['id'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return posts;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findByPk(postId);
  if (!post) throw new Error('Post not found');
  if (post.userId !== userId) throw new Error('Not authorized to delete this post');

  await post.destroy();
  return { message: 'Post deleted successfully' };
};

module.exports = { createPost, getAllPosts, getReels, getPostById, getUserPosts, deletePost };

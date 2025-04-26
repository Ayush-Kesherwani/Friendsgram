import React, { useState } from 'react';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !file) {
      return alert('Nothing to post. Are you okay?');
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('media', file);
      formData.append('userId', user?.user?._id);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload post');
      }

      alert('Post uploaded successfully!');

      // Clear form
      setCaption('');
      setFile(null);
      setPreview(null);

    } catch (error) {
      console.error('Error uploading post:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white/80 dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
          rows="3"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full
            file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />

        {preview && (
          <div className="mt-3">
            {file && file.type.startsWith('image') ? (
              <img src={preview} alt="Preview" className="rounded-md w-full max-h-80 object-cover" />
            ) : (
              <video src={preview} controls className="rounded-md w-full max-h-80" />
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

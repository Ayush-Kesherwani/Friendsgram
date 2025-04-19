import React, { useState } from 'react';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!caption) return alert('Nothing to post. Are you ok?');

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('media', file);
    formData.append('userId', user?.user?._id);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Post uploaded successfully!');
        setCaption('');
        setFile(null);
        setPreview(null);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white bg-transparent shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-200 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {preview && (
          <div className="mt-2">
            {file.type.startsWith('image') ? (
              <img src={preview} alt="preview" className="w-full max-h-80 object-cover rounded" />
            ) : (
              <video src={preview} controls className="w-full max-h-80 rounded" />
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

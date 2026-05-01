function CaptionInput() {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Caption
      </label>

      <textarea
        placeholder="Write something about your food..."
        rows="4"
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-400 resize-none"
      ></textarea>
    </div>
  )
}

export default CaptionInput
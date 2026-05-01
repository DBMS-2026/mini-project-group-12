function VideoPlayer({ video }) {
  return (
    <video
      src={video}
      controls
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  )
}

export default VideoPlayer
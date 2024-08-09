import Loader from '@/components/Loader'

const ChannelLoadingPage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <Loader message="Loading channel..." />
    </div>
  )
}

export default ChannelLoadingPage

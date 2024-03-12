import Loader from '@/components/Loader'

const ServerIdLoadingPage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <Loader message="Loading server..." />
    </div>
  )
}

export default ServerIdLoadingPage

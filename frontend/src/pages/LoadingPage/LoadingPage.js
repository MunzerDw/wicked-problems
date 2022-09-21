import Loading from '../../components/Loading'

function LoadingPage() {
  return (
    <div className="h-screen w-screen dark:bg-gray-600 flex">
      <div className="m-auto">
        <Loading radius="64" />
      </div>
    </div>
  )
}

export default LoadingPage

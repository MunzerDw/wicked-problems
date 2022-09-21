import CanvasPage from 'components/CanvasPage/CanvasPage'

function PublicAnalysis() {
  const name = window.location.pathname.split('/')[2]
  return <CanvasPage>Public Analysis | {name}</CanvasPage>
}

export default PublicAnalysis

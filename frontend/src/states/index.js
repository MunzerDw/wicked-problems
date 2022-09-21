import GlobalState from './GlobalState'

function States(props) {
  return <GlobalState.Provider>{props.children}</GlobalState.Provider>
}

const contexts = {
  GlobalCtx: GlobalState.Context,
}

export { States, contexts }

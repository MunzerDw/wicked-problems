import Node from './Node'
import Dropdown from 'components/Dropdown'
import Flex from 'components/Flex'
import Icon from 'components/Icon'
import project from 'models/Project'
import Badge from 'components/Badge'

function Idea({ ...props }) {
  return (
    <Node {...props} color={'#F59E0B'} icon="FaLightbulb">
      {(node, onDoubleClick) => {
        const vote = node.data?.vote
        return (
          <>
            <Flex.Col
              justify="between"
              space="1"
              className="w-full p-1 pl-0"
              style={{
                minHeight: '120px',
              }}
            >
              <Flex.Row justify="end" className="w-full h-8" space="1">
                <Dropdown
                  trigger={
                    <Icon name="FaEllipsisV" className="cursor-pointer" />
                  }
                  actions={[
                    {
                      key: (
                        <Flex.Row>
                          <Icon name="FaEdit" />
                          <div>edit</div>
                        </Flex.Row>
                      ),
                      action: () => {
                        onDoubleClick()
                      },
                    },
                    {
                      key: (
                        <Flex.Row>
                          <Icon name="FaTrashAlt" />
                          <div>delete</div>
                        </Flex.Row>
                      ),
                      action: () => {
                        project.deleteNodes([node.id])
                      },
                    },
                  ]}
                />
              </Flex.Row>
              {node?.data?.text ? (
                <div>{node?.data?.text}</div>
              ) : (
                <div className="opacity-50">
                  {'Double click to edit the node'}
                </div>
              )}
              <Flex.Row justify="end" className="w-full h-8" space="2">
                <Badge
                  className="text-white"
                  color="gray-400"
                  text={(node.data?.evidences?.length || 0) + ' evidence'}
                />
                <Flex.Row
                  space="1"
                  className={
                    'hover:text-indigo-400 cursor-pointer w-8 ' +
                    (vote?.vote === true && 'text-indigo-400')
                  }
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    await project.vote({
                      nodeId: node.id,
                      vote: vote?.vote === true ? null : true,
                    })
                  }}
                >
                  <Icon title="downvote" name="FaChevronUp" />
                  <div>
                    {node.data?.votes?.filter((vote) => {
                      return vote.vote === true
                    }).length || '0'}
                  </div>
                </Flex.Row>
                <Flex.Row
                  space="1"
                  className={
                    'hover:text-red-500 cursor-pointer w-8 ' +
                    (vote?.vote === false && 'text-red-500')
                  }
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    await project.vote({
                      nodeId: node.id,
                      vote: vote?.vote === false ? null : false,
                    })
                  }}
                >
                  <Icon title="downvote" name="FaChevronDown" />
                  <div>
                    {node.data?.votes?.filter((vote) => {
                      return vote.vote === false
                    }).length || '0'}
                  </div>
                </Flex.Row>
              </Flex.Row>
            </Flex.Col>
          </>
        )
      }}
    </Node>
  )
}

export default Idea

import Node from './Node'
import Dropdown from 'components/Dropdown'
import Flex from 'components/Flex'
import Icon from 'components/Icon'
import project from 'models/Project'
import Badge from 'components/Badge'

function Argument({ ...props }) {
  return (
    <Node
      {...props}
      color={props.data.for ? '#10B981' : '#EF4444'}
      icon={props.data.for ? 'FaCheck' : 'FaTimes'}
    >
      {(node, onDoubleClick) => {
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
              </Flex.Row>
            </Flex.Col>
          </>
        )
      }}
    </Node>
  )
}

export default Argument

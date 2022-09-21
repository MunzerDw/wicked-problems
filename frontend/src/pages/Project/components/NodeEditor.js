import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import nodeEditor from 'models/NodeEditor'
import Icon from 'components/Icon'
import Flex from 'components/Flex'
import Textarea from 'components/Textarea'
import project from 'models/Project'
import Button from 'components/Button'
import EvidenceEditor from './EvidenceEditor'
import evidenceEditor from 'models/EvidenceEditor'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import Badge from 'components/Badge'

function formatDate(date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}

// https://dev.to/nombrekeff/download-file-from-blob-21ho
function downloadFile(blob, name) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob)
    return window.navigator.msSaveOrOpenBlob(blob)

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = data
  link.download = name

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  )

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data)
    link.remove()
  }, 100)
}

const NodeEditor = observer(() => {
  const node = nodeEditor.editorNode || {}
  const vote = node.data?.vote

  useEffect(() => {
    if (node.id) {
      document.getElementById('editorTextarea').focus()
    }
  }, [node.id])

  let icon, color
  switch (node.type) {
    case 'ARGUMENT':
      if (node.data.for) {
        icon = 'FaCheck'
        color = '#10B981'
      } else {
        icon = 'FaTimes'
        color = '#EF4444'
      }
      break
    case 'IDEA':
      icon = 'FaLightbulb'
      color = '#F59E0B'
      break
    case 'ACTION':
      icon = 'FaArrowsAlt'
      color = '#818CF8'
      break
    case 'CONSTRAINT':
      icon = 'FaExclamationTriangle'
      color = ''
      break
    case 'QUESTION':
      icon = 'FaQuestion'
      color = '#fce71e'
      break

    default:
      break
  }

  return (
    <>
      <EvidenceEditor />
      <div
        className={
          'fixed top-0 right-0 h-full bg-white dark:bg-gray-700 shadow-lg dark:border-non trans overflow-auto ' +
          (nodeEditor.open ? 'w-96' : 'w-0')
        }
        style={{
          zIndex: '110',
        }}
      >
        <Icon
          className="absolute top-0 left-0 cursor-pointer m-4"
          name="FaTimes"
          size="25"
          onClick={() => {
            nodeEditor.setOpen(false)
          }}
        />
        <div className="absolute top-0 right-0 cursor-pointer flex flex-col space-y-1 text-sm text-gray-500 m-1">
          <Flex.Row>x: {Math.floor(node?.data?.x * 100) / 100}</Flex.Row>
          <Flex.Row>y: {Math.floor(node?.data?.y * 100) / 100}</Flex.Row>
        </div>
        <br />
        <br />
        <Flex.Col className="p-6" space="16">
          <div className="bg-gray-200 dark:bg-gray-800 rounded w-full">
            <Flex.Row space="0">
              <div className="flex p-4 rounded-full">
                <Icon size={50} name={icon} className="m-auto" color={color} />
              </div>
              <div className="p-2 pl-0 w-full">
                <Textarea
                  id="editorTextarea"
                  style={{ height: '150px' }}
                  value={node.data?.text}
                  onChange={(e) => {
                    if (nodeEditor?.editorNode?.data) {
                      nodeEditor.setEditorNode({
                        ...nodeEditor.editorNode,
                        data: {
                          ...nodeEditor.editorNode.data,
                          text: e.currentTarget.value,
                        },
                      })
                      project.editNode(
                        {
                          text: e.currentTarget.value,
                        },
                        nodeEditor.editorNode?.id
                      )
                    }
                  }}
                  onBlur={(e) => {
                    if (nodeEditor?.editorNode?.id) {
                      project.updateNode(
                        {
                          text: e.currentTarget.value,
                        },
                        nodeEditor?.editorNode?.id
                      )
                    }
                  }}
                />
              </div>
            </Flex.Row>
          </div>
          {node.type === 'ACTION' && (
            <Flex.Col className="w-full" space="0">
              <div className="text-lg">When did this action occur?</div>
              <Flex.Row className="w-full" justify="between">
                <Flex.Row space="1">
                  <Badge
                    className="bg-gray-200 dark:bg-gray-600 py-1"
                    text={
                      <Flex.Row space="1">
                        {node.data?.doneAt ? (
                          <>
                            <Icon
                              className="opacity-75 hover:opacity-100 cursor-pointer"
                              name="FaTimes"
                              onClick={async (date) => {
                                await project.updateNode(
                                  {
                                    doneAt: null,
                                  },
                                  node.id
                                )
                              }}
                            />
                            <div className="font-normal">occured at: </div>{' '}
                            <div>{formatDate(new Date(node.data?.doneAt))}</div>
                          </>
                        ) : (
                          'no date selected'
                        )}
                      </Flex.Row>
                    }
                  />
                  <DatePicker
                    selected={
                      node.data?.doneAt ? new Date(node.data?.doneAt) : null
                    }
                    showIcon={false}
                    onChange={async (date) => {
                      project.updateNode({
                        doneAt: date,
                      })
                    }}
                    title="When has this action been taken?"
                    customInput={
                      <Button
                        className="opacity-75 hover:opacity-100"
                        icon="FaCalendarAlt"
                      />
                    }
                    customStyles={{
                      dateInput: {
                        width: 0,
                        height: 0,
                        borderWidth: 0,
                      },
                    }}
                    style={{ width: 0, height: 0, display: 'none' }}
                  >
                    <div>When has this action been taken?</div>
                  </DatePicker>
                </Flex.Row>
              </Flex.Row>
            </Flex.Col>
          )}
          {(node.type === 'ACTION' || node.type === 'IDEA') && (
            <Flex.Row className="w-full" justify="around" space="0">
              <div
                className={
                  'flex p-4 rounded border cursor-pointer flex-col space-around items-center trans ' +
                  (node.data?.vote?.vote === true
                    ? 'text-indigo-400 border-indigo-400'
                    : '')
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
                <Icon size={50} name={'FaChevronUp'} className="m-auto" />
                <div>
                  {node.data?.votes?.filter((vote) => {
                    return vote.vote === true
                  }).length || '0'}
                </div>
              </div>
              <div
                className={
                  'flex p-4 rounded border cursor-pointer flex-col space-around items-center trans ' +
                  (node.data?.vote?.vote === false
                    ? 'text-red-500 border-red-500'
                    : '')
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
                <Icon size={50} name={'FaChevronDown'} className="m-auto" />
                <div>
                  {node.data?.votes?.filter((vote) => {
                    return vote.vote === false
                  }).length || '0'}
                </div>
              </div>
            </Flex.Row>
          )}
            <Flex.Col className="w-full">
              <Flex.Row className="w-full" justify="between" space="0">
                <div>Evidence</div>
                <Button
                  color="green"
                  basic
                  onClick={() => {
                    evidenceEditor.setOpen(true)
                  }}
                >
                  Add
                </Button>
              </Flex.Row>
              <Flex.Col className="w-full" space="2">
                {node.data?.evidences?.map((ev, i) => {
                  return (
                    <Flex.Row
                      key={i}
                      justify="between"
                      align="start"
                      className="w-full p-2 bg-gray-200 dark:bg-gray-800 rounded"
                    >
                      <Flex.Col>
                        {ev.text && (
                          <Flex.Col space="1">
                            <div className="opacity-75 text-xs">text</div>
                            <div>{ev.text}</div>
                          </Flex.Col>
                        )}
                        {ev.file && (
                          <Flex.Col space="1">
                            <div className="opacity-75 text-xs flex space-x-2">
                              <Icon name="FaFileAlt" /> <div>file</div>
                            </div>
                            <div
                              className="hover:text-blue-400 cursor-pointer"
                              onClick={async () => {
                                axios('/uploads/' + ev.file.filename, {
                                  method: 'GET',
                                  responseType: 'blob',
                                })
                                  .then((response) => {
                                    const file = new Blob([response.data], {
                                      type: ev.file.mimetype,
                                    })
                                    const fileURL = URL.createObjectURL(file)
                                    window.open(fileURL)
                                  })
                                  .catch((error) => {
                                    alert(error.message)
                                  })
                              }}
                            >
                              {ev.file.originalname}
                            </div>
                            {/* <a
                              href={
                                process.env.REACT_APP_BACKEND_URL +
                                '/uploads/' +
                                ev.file.filename
                              }
                              className="hover:text-blue-400 cursor-pointer"
                            >
                              {ev.file.originalname}
                            </a> */}
                          </Flex.Col>
                        )}
                      </Flex.Col>
                      <Flex.Row space="0">
                        {ev.file && (
                          <Button
                            basic
                            icon="FaDownload"
                            onClick={async () => {
                              axios('/uploads/' + ev.file.filename, {
                                method: 'GET',
                                responseType: 'blob',
                              })
                                .then((response) => {
                                  const file = new Blob([response.data], {
                                    type: ev.file.mimetype,
                                  })
                                  downloadFile(file, ev.file.originalname)
                                })
                                .catch((error) => {
                                  alert(error.message)
                                })
                            }}
                          />
                        )}
                        <Button
                          basic
                          icon="FaTrashAlt"
                          iconColor="yellow"
                          onClick={() => {
                            project.deleteEvidences([ev])
                          }}
                        />
                      </Flex.Row>
                    </Flex.Row>
                  )
                })}
              </Flex.Col>
            </Flex.Col>
        </Flex.Col>
      </div>
    </>
  )
})

export default NodeEditor

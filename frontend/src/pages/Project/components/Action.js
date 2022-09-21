import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Flex from 'components/Flex'
import Icon from 'components/Icon'
import project from 'models/Project'
import Node from './Node'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Badge from 'components/Badge'
import SimpleButton from 'components/SimpleButton'
import Select from 'components/Select'
import settings from 'models/Settings'

function formatDate(date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}
// https://renatello.com/javascript-array-of-years/
function generateArrayOfYears() {
  var max = new Date().getFullYear()
  var min = 1970
  var years = []

  for (var i = max; i >= min; i--) {
    years.push(i)
  }
  return years
}

const years = generateArrayOfYears()
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function Action({ ...props }) {
  return (
    <Node {...props} color={'#818CF8'} icon="FaArrowsAlt">
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
                {node.data?.doneAt && (
                  <Badge
                    className="bg-gray-200 dark:bg-gray-600 py-1"
                    text={
                      <Flex.Row space="1">
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
                      </Flex.Row>
                    }
                  />
                )}
                <DatePicker
                  renderCustomHeader={({
                    customHeaderCount,
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      >
                        {'<'}
                      </button>
                      <select
                        value={
                          (date.getMonth() + customHeaderCount) %
                            months.length ===
                          0
                            ? date.getFullYear() + customHeaderCount
                            : date.getFullYear()
                        }
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        value={
                          months[
                            (date.getMonth() + customHeaderCount) %
                              months.length
                          ]
                        }
                        onChange={({ target: { value } }) =>
                          changeMonth(months.indexOf(value))
                        }
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      >
                        {'>'}
                      </button>
                    </div>
                  )}
                  selected={
                    node.data?.doneAt ? new Date(node.data?.doneAt) : null
                  }
                  showIcon={false}
                  onChange={async (date) => {
                    await project.updateNode(
                      {
                        doneAt: date,
                      },
                      node.id
                    )
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
                  <div className="w-full text-center">
                    When has this action been taken?
                  </div>
                </DatePicker>
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
                <Select
                  setSelectedItem={async (obj) => {
                    await project.updateNode(
                      {
                        labelId: obj.value,
                      },
                      node.id
                    )
                  }}
                  trigger={
                    node.data?.labelId ? (
                      <Badge
                        className="py-1 text-white rounded mx-auto"
                        style={{
                          backgroundColor: node.data?.label?.color,
                        }}
                        text={
                          <Flex.Row space="1">
                            <Icon
                              className="opacity-75 hover:opacity-100 cursor-pointer"
                              name="FaTimes"
                              onClick={async (e) => {
                                e.stopPropagation()
                                await project.updateNode(
                                  {
                                    labelId: null,
                                  },
                                  node.id
                                )
                              }}
                            />
                            <div className="font-normal">
                              {node.data?.label?.text}
                            </div>
                          </Flex.Row>
                        }
                      />
                    ) : settings.labels.length ? (
                      <SimpleButton className="px-1" text={'select label'} />
                    ) : (
                      <div>no labels</div>
                    )
                  }
                  data={settings.labels.map((label) => {
                    return {
                      key: (
                        <Badge
                          className=" text-white rounded mx-auto w-full"
                          style={{
                            backgroundColor: label.color,
                          }}
                          text={
                            <Flex.Row justify="center" space="1">
                              <div className="font-normal text-xs">
                                {label.text}
                              </div>
                            </Flex.Row>
                          }
                        />
                      ),
                      value: label.id,
                    }
                  })}
                />
                <Flex.Row space="2">
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
              </Flex.Row>
            </Flex.Col>
          </>
        )
      }}
    </Node>
  )
}

export default Action

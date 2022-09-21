import Button from 'components/Button'
import CanvasPage from 'components/CanvasPage/CanvasPage'
import Flex from 'components/Flex'
import { observer } from 'mobx-react'
import snapshotEditor from 'models/SnapshotEditor'
import snapshots from 'models/Snapshots'
import ImportData from './components/ImportData'
import Snapshot from './components/Snapshot'
import SnapshotEditor from './components/SnapshotEditor'
import SnapshotsCombined from './components/SnapshotsCombined'
import Timeline from './components/Timeline'
import Correlations from './components/Correlations'
import settings from 'models/Settings'
import SelectMultiple from 'components/SelectMultiple'
import project from 'models/Project'

const Snapshots = observer(() => {
  const urlSafeName = window.location.pathname.split('/')[2]
  return (
    <CanvasPage className="flex justify-center p-12">
      <Timeline />
      <Correlations />
      <Flex.Col className="w-full" style={{}} space="8">
        <Flex.Col space="1" className="w-full">
          <Flex.Row className="w-full" justify="between">
            <div className="text-4xl font-medium">Snapshots</div>
            <Flex.Row>
              <SelectMultiple
                placeholder="filter actions"
                data={[
                  ...settings.labels.map((s) => ({
                    key: s?.text,
                    value: s,
                  })),
                  { key: 'NO LABEL', value: null },
                ]}
                selectedItems={snapshots.filteredLabels.map((s) => ({
                  key: s?.text || 'NO LABEL',
                  value: s,
                }))}
                setSelectedItems={(data) => {
                  snapshots.setFilteredLabels(data.map((d) => d.value))
                }}
              />
              <Button
                basic
                onClick={() => {
                  snapshots.calculateCorrelations(urlSafeName)
                  snapshots.setCorrelationsOpen(true)
                }}
              >
                Correlations
              </Button>
              <Button
                basic
                onClick={() => {
                  snapshots.setTimelineOpen(true)
                }}
              >
                View Actions Timeline
              </Button>
              {project.isLoggedIn() && (
                <Button
                  basic
                  color="green"
                  onClick={() => {
                    snapshotEditor.setEditorSnapshot({ name: '' })
                    snapshotEditor.setOpen(true)
                  }}
                >
                  Add Snapshot
                </Button>
              )}
            </Flex.Row>
          </Flex.Row>
          <Flex.Row space="0">
            <div>view: </div>
            <Button
              basic
              icon="FaList"
              color={snapshots.getView() === 'list' ? 'lightgray' : 'gray'}
              onClick={() => {
                snapshots.setView('list')
              }}
            />
            <Button
              basic
              icon="FaTh"
              color={snapshots.getView() === 'one' ? 'lightgray' : 'gray'}
              onClick={() => {
                snapshots.setView('one')
              }}
            />
          </Flex.Row>
        </Flex.Col>
        {snapshots.view === 'list' ? (
          <Flex.Row
            className="w-full"
            align="start"
            style={{
              minHeight: '600px',
            }}
          >
            <Flex.Col justify="start" space="0">
              {snapshots.snapshots?.map((snapshot, i) => {
                return (
                  <div
                    onClick={() => {
                      document.getElementById(snapshot.id) &&
                        document.getElementById(snapshot.id).scrollIntoView()
                    }}
                    className={
                      'w-full p-2 cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 trans ' +
                      (i === 0
                        ? 'rounded-t'
                        : i === snapshots.snapshots?.length - 1
                        ? 'rounded-b'
                        : '')
                    }
                    key={i}
                  >
                    {snapshot.name}
                  </div>
                )
              })}
            </Flex.Col>
            <Flex.Col className="w-full h-full overflow-auto p-2" space="16">
              {snapshots.snapshots?.map((snaphshot, i) => {
                return <Snapshot index={i} key={i} id={snaphshot.id} />
              })}
            </Flex.Col>
          </Flex.Row>
        ) : (
          <>
            <SnapshotsCombined />
            <div className="opacity-0">This has to be here for some reason</div>
          </>
        )}
      </Flex.Col>
      <SnapshotEditor />
      <ImportData />
    </CanvasPage>
  )
})

export default Snapshots

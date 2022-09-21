import Button from 'components/Button'
import Flex from 'components/Flex'
import Popup from 'components/Popup'
import { observer } from 'mobx-react'
import snapshots from 'models/Snapshots'
import Loading from 'components/Loading'
import Correlation from './Correlation'

const Correlations = observer(() => {
  const correlations = snapshots.correlations
  return (
    <Popup
      state={snapshots.correlationsOpen}
      setState={snapshots.setCorrelationsOpen}
    >
      <div
        className="bg-gray-200 dark:bg-gray-800 shadow-lg rounded p-6 max-h-full overflow-auto relative w-full"
        style={{ maxWidth: '1000px' }}
      >
        <div
          className="sticky top-0 w-full flex justify-end"
          style={{
            left: '500px',
          }}
        >
          <Button
            icon="FaTimes"
            onClick={() => {
              snapshots.setCorrelationsOpen(false)
            }}
          />
        </div>
        <Flex.Col>
          <div className="text-xl font-bold">
            Correlations between snapshots data
          </div>
          <div>
            The following shows the correlations between all snapshots data you
            have added, with normalized values. The closer the correlation is to
            1, the more the two data sets behave similarly.
          </div>
        </Flex.Col>
        <br />
        {snapshots.correlationsLoading ? (
          <div className="relative py-8">{<Loading />}</div>
        ) : (
          <Flex.Col>
            {correlations?.map((corr, i) => {
              return <Correlation key={i} correlation={corr} />
            })}
          </Flex.Col>
        )}
      </div>
    </Popup>
  )
})
export default Correlations

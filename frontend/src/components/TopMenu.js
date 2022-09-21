import ThemeToogle from './ThemeToogle'
import User from './User'

function TopMenu() {
  return (
    <div
      className="w-full h-full bg-white dark:bg-gray-700 p-6 flex shadow"
      style={{
        maxHeight: '90px',
      }}
    >
      <div className="w-full flex justify-between items-center my-auto">
        <div
          className="text-2xl font-medium dark:text-white"
          style={{
            fontFamily: 'Pattaya',
          }}
        >
          Wicked Problems
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToogle />
          <User />
        </div>
      </div>
    </div>
  )
}
export default TopMenu

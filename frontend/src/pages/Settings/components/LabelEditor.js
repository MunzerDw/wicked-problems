import Button from 'components/Button'
import Flex from 'components/Flex'
import Form from 'components/Form'
import Input from 'components/Input'
import Popup from 'components/Popup'
import { observer } from 'mobx-react'
import settings from 'models/Settings'
import { ChromePicker } from 'react-color'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import { useState } from 'react'

const LabelEditor = observer(() => {
  const editorLabel = settings.getEditorLabel()
  const [color, setColor] = useState({
    rgb: {
      r: editorLabel.color?.split('(')[1].split(',')[0],
      g: editorLabel.color?.split('(')[1].split(',')[1],
      b: editorLabel.color?.split('(')[1].split(',')[2],
      a: editorLabel.color?.split('(')[1].split(',')[3].replace(')', ''),
    },
  })
  return (
    <Popup
      state={settings.open}
      setState={settings.setOpen}
      onClose={() => settings.setEditorLabel({ text: '', color: '' })}
    >
      <Form
        className="bg-white dark:bg-gray-700 shadow-lg rounded p-6"
        onSubmit={async () => {
          if (editorLabel.id) {
            await settings.updateLabel(
              {
                text: editorLabel.text,
                color: editorLabel.color,
              },
              editorLabel.id
            )
          } else {
            await settings.createLabel(editorLabel)
          }
          settings.setOpen(false)
        }}
      >
        <div className="w-full flex">
          <Badge
            className="py-1 text-white rounded mx-auto"
            style={{
              backgroundColor: editorLabel.color,
            }}
            text={
              <Flex.Row space="1">
                <Icon className="opacity-75 hover:opacity-100" name="FaTimes" />
                {editorLabel.text ? (
                  <div className="font-normal">{editorLabel.text}</div>
                ) : (
                  <div className="opacity-50">text</div>
                )}
              </Flex.Row>
            }
          />
        </div>
        <Input
          required
          label="Text"
          value={editorLabel.text}
          onChange={(e) => {
            const value = e.currentTarget.value
            settings.setEditorLabel({ ...editorLabel, text: value })
          }}
        />
        <Flex.Col space="2">
          <label>Color</label>
          <ChromePicker
            color={color}
            onChange={(color) => {
              console.log(color)
              const rgb = color.rgb
              setColor(color)
              settings.setEditorLabel({
                ...editorLabel,
                color: `rgb(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
              })
            }}
          />
        </Flex.Col>
        <Flex.Row space="2">
          <Button basic color="green" type="submit">
            {editorLabel.id ? 'Save' : 'Add'}
          </Button>
          <Button
            basic
            color="gray"
            onClick={() => {
              settings.setOpen(false)
            }}
          >
            Cancel
          </Button>
        </Flex.Row>
      </Form>
    </Popup>
  )
})
export default LabelEditor

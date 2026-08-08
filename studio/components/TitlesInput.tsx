import {TextArea} from '@sanity/ui'
import {set, unset} from 'sanity'
import type {ArrayOfPrimitivesInputProps} from 'sanity'

/** Lets you paste/type every title in one go (one per line) instead of adding array
 * items one by one — splits on newline and writes the array on blur. Uncontrolled
 * (defaultValue + onBlur) so typing doesn't fight the array-patch round-trip. */
export function TitlesInput(props: ArrayOfPrimitivesInputProps) {
  const {value, onChange} = props
  const text = ((value as string[]) || []).join('\n')

  return (
    <TextArea
      rows={6}
      defaultValue={text}
      placeholder={'Un titre par ligne, par exemple :\nChampion de France\nCACIB Paris 2026'}
      onBlur={(event) => {
        const lines = event.currentTarget.value
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
        onChange(lines.length > 0 ? set(lines) : unset())
      }}
    />
  )
}

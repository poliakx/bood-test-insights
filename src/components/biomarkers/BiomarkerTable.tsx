import React from 'react'
import BiomarkerRow from './BiomarkerRow'

export default function BiomarkerTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <BiomarkerRow />
      </tbody>
    </table>
  )
}

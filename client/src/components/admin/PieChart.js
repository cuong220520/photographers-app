import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { VictoryPie } from 'victory'

const elements = [
  { color: 'gold', text: 'Computer Science' },
  { color: 'cyan', text: 'Business' },
  { color: 'navy', text: 'Design' },
]

function PieChart({ skillCounts, totalCount }) {
  return (
    <>
      <VictoryPie
        // data={[
        //   {
        //     x: `33%`,
        //     y: 33,
        //   },
        //   {
        //     x: `33%`,
        //     y: 33,
        //   },
        //   {
        //     x: `33%`,
        //     y: 33,
        //   },
        // ]}

        data={skillCounts.map((skillCount) => {
          return {
            x: skillCount.skill,
            y: (skillCount.count / totalCount) * 100,
          }
        })}
      />

      <p variant='h6'>
        Chart 1: Pie chart of the percentage of total users/photographers by
        each skill
      </p>
    </>
  )
}

PieChart.propTypes = {}

export default PieChart

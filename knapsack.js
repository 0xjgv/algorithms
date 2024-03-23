const getKnapSackMemo = ((memo) => (capacity, n, values, weights) => {
  if (capacity < 0) {
    return Number.MIN_SAFE_INTEGER
  } else if (capacity === 0 || n < 0) {
    return 0
  }

  const uniqueKey = `${n}|${capacity}`
  if (!memo.has(uniqueKey)) {
    // Substract weights[n] from capacity and add values[n] to the result
    const withItem =
      values[n] + getKnapSackMemo(capacity - weights[n], n - 1, values, weights)

    // Keep the capacity same and move to the next item
    const withoutItem = getKnapSackMemo(capacity, n - 1, values, weights)

    memo.set(uniqueKey, Math.max(withItem, withoutItem))
  }

  return memo.get(uniqueKey)
})(new Map())

function getKnapSackIter(capacity, values, weights) {
  const matrix = Array.from({ length: values.length + 1 }, () =>
    Array.from({ length: capacity + 1 }, () => 0)
  )

  for (let i = 1; i <= values.length; i++) {
    // choose all weights from 0 to maximum capacity

    for (let j = 0; j <= capacity; j++) {
      // Ignore negative weights
      if (weights[i - 1] > j) {
        matrix[i][j] = matrix[i - 1][j]
      } else {
        // Select the maximum value by either including or excluding the item
        matrix[i][j] = Math.max(
          matrix[i - 1][j],
          matrix[i - 1][j - weights[i - 1]] + values[i - 1]
        )
      }
    }
  }

  // Maximum value will be at the bottom-right corner.
  return matrix[values.length][capacity]
}

const values = [
  10, 20, 30, 40, 25, 35, 45, 28, 38, 48, 15, 25, 35, 45, 30, 40, 50, 33, 43,
  53, 10, 20, 30, 40, 25, 35, 45, 28, 38, 48, 15, 25, 35, 45, 30, 40, 50, 33,
  10, 20, 30, 40, 25, 35, 45, 28, 38, 48, 15, 25, 35, 45, 30, 40, 50, 33, 43,
  43, 53
]
const weights = [
  30, 10, 40, 20, 25, 15, 35, 18, 28, 38, 22, 12, 32, 42, 26, 16, 36, 19, 29,
  39, 30, 10, 40, 20, 25, 15, 35, 18, 28, 38, 22, 12, 32, 42, 26, 16, 36, 19,
  30, 10, 40, 20, 25, 15, 35, 18, 28, 38, 22, 12, 32, 42, 26, 16, 36, 19, 29,
  29, 39
]
const capacity = 250

console.time('Memoization Method')
const memoStartMem = process.memoryUsage().heapUsed / 1024 / 1024 // Convert bytes to megabytes
const resultMemo = getKnapSackMemo(capacity, values.length - 1, values, weights)
const memoEndMem = process.memoryUsage().heapUsed / 1024 / 1024 // Convert bytes to megabytes
console.timeEnd('Memoization Method')
const memoMemoryUsed = memoEndMem - memoStartMem
console.log(
  `Memory used by Memoization Method: ${memoMemoryUsed.toFixed(2)} MB`
)

console.time('Iterative Method')
const iterStartMem = process.memoryUsage().heapUsed / 1024 / 1024 // Convert bytes to megabytes
const resultIter = getKnapSackIter(capacity, values, weights)
const iterEndMem = process.memoryUsage().heapUsed / 1024 / 1024 // Convert bytes to megabytes
console.timeEnd('Iterative Method')
const iterMemoryUsed = iterEndMem - iterStartMem
console.log(`Memory used by Iterative Method: ${iterMemoryUsed.toFixed(2)} MB`)

console.log({ resultMemo, resultIter })

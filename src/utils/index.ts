export const getPos = (ref: any) =>
  ref.current ? (Object.values(ref.current?.object.position) as vector) : undefined

export const subV = (a: vector, b: vector): vector => a.map((ai, i) => ai - b[i]) as vector
export const addV = (a: vector, b: vector): vector => a.map((ai, i) => ai + b[i]) as vector

export type vector = [number, number, number]

export const arrayComparator = (a: any[], b: any[]) => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

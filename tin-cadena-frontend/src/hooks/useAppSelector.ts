// src/hooks/useAppSelector.ts

import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

export const useAppSelector = <TSelected,>(
  selector: (state: RootState) => TSelected,
) => useSelector<RootState, TSelected>(selector)
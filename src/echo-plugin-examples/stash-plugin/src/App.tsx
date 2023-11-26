import { useState } from 'react'
import { context } from './entry'
import { delay, filter, last, scan, tap, toArray } from 'rxjs'
import { EchoPoeItem, validResults } from 'echo-common'
import { useTranslation } from 'react-i18next'

const App = () => {
  const { t } = useTranslation()
  const league = 'Ancestor'

  const [searchString, setSearchString] = useState('')
  const [status, setStatus] = useState('')

  const { value: stashes } = context().poeStash.useStashes(league)

  const stashItems = context()
    .poeStash.usePoeStashItems(league)
    .filter(
      (e) =>
        !searchString.length || e.data.typeLine?.toLowerCase().includes(searchString.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.stash?.loadedAtTimestamp || 0).getTime() -
        new Date(a.stash?.loadedAtTimestamp || 0).getTime()
    )

  return (
    <>
      <div className="flex flex-col h-full w-full pt-2 pl-2 pr-2">
        <div>{t('label.status') + status}</div>
        <div className="flex-shrink-0 flex flex-row gap-2 overflow-x-scroll pb-5 pt-2">
          {(stashes ?? []).map((partialTab) => (
            <div
              key={partialTab.id}
              style={{ backgroundColor: `#${partialTab.metadata?.colour}` }}
              className="flex-shrink-0 cursor-pointer py-2 px-4 shadow-md no-underline rounded-full  text-white text-sm hover:text-white hover:bg-blue-light focus:outline-none active:shadow-none mr-2"
              onClick={() =>
                context()
                  .poeStash.snapshot(league, [partialTab.id!!])
                  .pipe(
                    tap((e) => {
                      if (e.type === 'rate-limit') {
                        setStatus(`${e.type}, ${Date.now() + e.limitExpiresMs}`)
                      } else {
                        setStatus(e.type)
                      }
                    }),
                    validResults(),
                    toArray()
                  )
                  .subscribe((items) => {
                    setStatus(`loaded ${items.length}`)
                    console.log('final items', items)
                  })
              }
            >
              {partialTab.name}
            </div>
          ))}
        </div>
        <div className="flex-shrink-0">
          <input
            type="text"
            placeholder={t('label.searchPlaceholder')}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="w-full px-2 py-0.5 bg-input-surface rounded-lg shadow-md border-0 focus:outline-none focus:ring focus:border-primary-accent"
          />
        </div>
        <div className="overflow-y-scroll flex-1 mt-2">
          {(stashItems ?? []).map((e) => (
            <div key={e.data.id}>
              <div>
                <span style={{ color: `#${e.stash?.metadata?.colour}` }}>{e.stash?.name}</span>:{' '}
                {e.data.stackSize} {e.data.typeLine}
              </div>
              {e.group ? (
                <div>
                  Group: {e.group.tag} {e.group.shard} {e.group.hash}
                </div>
              ) : null}
              {e.valuation ? <div>Value {e.valuation?.pvs?.[5]}c</div> : null}
              <div>
                {e.data.properties?.map((p) => (
                  <li key={p.name}>
                    {p.name}: {p.values?.join(', ')}
                  </li>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App

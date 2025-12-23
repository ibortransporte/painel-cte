import { PanelBase, SearchInput, stringMatch } from '@fluxu-labs/lib';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function CTe() {
  // ----------------------------------------------------------------------

  const [searchString, setSearchString] = useState('');

  return (
    <PanelBase.Root floating>
      <PanelBase.Container floating>
        <PanelBase.Header2
          content={`CTe`}
          bottomComponent={
            <SearchInput
              searchString={searchString}
              setSearchString={setSearchString}
            />
          }
        />

        {/* <PanelBase.VirtualLazyList
          items={dataFiltered}
          loading={isLoading}
          estimateSize={215}
          renderItem={({ item }) => (
            <PanelBase.ListItem onClick={() => openDetails(item)}>
              <TrackingItem item={item} />
            </PanelBase.ListItem>
          )}
        /> */}
      </PanelBase.Container>
    </PanelBase.Root>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  data,
  searchString,
}: {
  data: Record<string, never>[];
  searchString: string;
}) {
  let _data = data;

  // filter
  if (searchString) {
    _data = _data.filter((item) => {
      if (stringMatch([].join(';'), searchString)) {
        return true;
      }

      return false;
    });
  }

  return _data;
}

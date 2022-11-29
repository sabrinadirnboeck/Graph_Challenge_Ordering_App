import "./DeletionPanel.css";
import { Stack, DefaultButton, Spinner, IObjectWithKey } from '@fluentui/react'
import { useDeleteSelectionMutation } from '../../hooks/useDeleteSelectionMutation'

type Props = {
    selectedItems: IObjectWithKey[] | undefined 
}

export const DeletionPanel = ( { selectedItems} : Props) => {
    const deleteSelectionMutation = useDeleteSelectionMutation(selectedItems);

  return (
    <div className="delete-button" >
    <Stack horizontal>
    <DefaultButton text="Delete selected order entries" disabled={deleteSelectionMutation.isLoading} onClick={() => deleteSelectionMutation.mutate()} />
    {deleteSelectionMutation.isLoading && (
      <Spinner label="Deleting selected items..." ariaLive="assertive" labelPosition="right" />
    )}
    </Stack>
  </div>
  )
}
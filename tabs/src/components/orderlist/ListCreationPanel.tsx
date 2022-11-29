import "./ListCreationPanel.css"
import { Button } from "@fluentui/react-northstar";
import { Stack } from '@fluentui/react';
import { useCreateListMutation } from '../../hooks/useCreateListMutation';

export const ListCreationPanel = () => {
    const createListMutation = useCreateListMutation();

  return (
    <div>
        <Stack horizontalAlign='center' className="list-create">
            <Button primary content="Create new order list" onClick={() => createListMutation.mutate()}/>
        </Stack>       
    </div>
  )
}
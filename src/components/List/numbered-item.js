import { ListContainer } from './list-container'
import { Typography } from '../Typography'

export function NumberedItem({ index, item, onDrag, onChange, onDelete, isActive }) {
    return (
        <ListContainer
            item={item}
            onDrag={onDrag}
            onChange={onChange}
            onDelete={onDelete}
            isActive={isActive}
        >
            <Typography>{index}.</Typography>
        </ListContainer>
    )
}

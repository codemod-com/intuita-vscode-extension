import { useCallback } from 'react';
import Tree, { TreeNode } from  '../Tree';

type Props = {
  node: TreeNode, 
}

const TreeView = ({ node }: Props) => {

  const handleClick = useCallback((node: TreeNode) => {
    console.log(node);
  }, []);

  const renderItem = useCallback((node: TreeNode, open: boolean, setIsOpen: ( value: boolean) => void) => {
    return <p
    className="cursor-pointer"
    id={node.id}
    onClick={() => {
      setIsOpen(!open);
      handleClick(node);
    }}
  >
    {node.label}
  </p>
  }, [handleClick]);

  return (
   <Tree node={node} renderItem={renderItem} />
  )
}

export default TreeView
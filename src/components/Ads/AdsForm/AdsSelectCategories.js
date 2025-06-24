import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Checkbox from '@mui/material/Checkbox';
import { fetchAllCategories } from '../../Categories/CategoriesServices';
import {useTranslation} from "react-i18next";
import { CardHeader } from '@mui/material';


const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.label}`]: {
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
    },
  },
}));

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

const RecursiveTreeItem = ({ node, selectedNode, onNodeSelect, usedIn }) => {
  const isLeaf = !node.sub_categories || node.sub_categories.length === 0;
  const isChecked = selectedNode === node.id;

  const handleCheck = (event) => {
    event.stopPropagation(); // Prevent tree item selection on checkbox click
    if (isLeaf || usedIn === 'banners') {
      onNodeSelect(node.id);
    }
  };

  return (
    <CustomTreeItem
      itemId={node.id}
      label={
        <>
          {node.name}
          {(isLeaf || usedIn === 'banners') && (
            <Checkbox
              checked={isChecked}
              onChange={handleCheck}
              onClick={(event) => event.stopPropagation()}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      }
      key={node.id}
    >
      {node.sub_categories && node.sub_categories.map((child) => (
        <RecursiveTreeItem
          key={child.id}
          node={child}
          selectedNode={selectedNode}
          onNodeSelect={onNodeSelect}
          usedIn={usedIn}
        />
      ))}
    </CustomTreeItem>
  );
};

export default function AdsSelectCategories({setValue , category_id, usedIn = 'ads'}) {
  const [categories, setCategories] = useState([]);
  const [selectedNode, setSelectedNode] = useState(category_id);
  const {t, i18n} = useTranslation()

  const getCategories = async () => {
    const data = await fetchAllCategories();
    setCategories(data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setSelectedNode(parseInt(category_id));
  } , [category_id])

  const handleNodeSelect = (nodeId) => {
    setSelectedNode((prevNode) => (prevNode === nodeId ? null : nodeId));
    setValue('category_id', nodeId);
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 , maxHeight:352 }} style={{ overflowY: 'scroll' }}>
      <CardHeader title={t('categories')} />

      <SimpleTreeView
        defaultExpandedItems={categories.map(category => category.id)}
        slots={{
          expandIcon: AddBoxIcon,
          collapseIcon: IndeterminateCheckBoxIcon,
          endIcon: CloseSquare,
        }}
      >
        {categories.map((category) => (
          <RecursiveTreeItem
            key={category.id}
            node={category}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            usedIn={usedIn}
          />
        ))}
      </SimpleTreeView>
    </Box>
  );
}

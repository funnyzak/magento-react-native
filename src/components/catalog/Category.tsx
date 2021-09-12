import React, { useContext, useEffect, FC } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { View, RefreshControl } from 'react-native';
import {
  addFilterData,
  getProductsForCategoryOrChild,
  setCurrentProduct,
  updateProductsForCategoryOrChild,
} from '../../actions';
import { ProductList, HeaderGridToggleIcon } from '../common';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_HOME_PRODUCT_PATH } from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { StoreStateType } from '../../reducers';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = (state: StoreStateType) => {
  const category = state.category.current?.category;
  const { products, totalCount, loadingMore, refreshing } = state.category;
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = state.magento;
  const { priceFilter, sortOrder } = state.filters;
  const productsLength = products?.length ? products.length : 0;
  const canLoadMoreContent = productsLength < totalCount;

  return {
    category,
    products,
    totalCount,
    canLoadMoreContent,
    loadingMore,
    refreshing,
    priceFilter,
    sortOrder,
    currencySymbol,
    currencyRate,
  };
};

const connector = connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  updateProductsForCategoryOrChild,
  setCurrentProduct,
  addFilterData,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

const Category: FC<Props> = ({
  canLoadMoreContent,
  loadingMore,
  products,
  totalCount,
  sortOrder, // Add its validation in prop-types
  priceFilter, // Add its validation in prop-types
  category,
  refreshing,
  navigation,
  currencySymbol,
  currencyRate,
  addFilterData: _addFilterData,
  getProductsForCategoryOrChild: _getProductsForCategoryOrChild,
  setCurrentProduct: _setCurrentProduct,
  updateProductsForCategoryOrChild: _updateProductsForCategoryOrChild,
}) => {
  const theme = useContext(ThemeContext);
  const listTypeGrid = useSelector(({ ui }: StoreStateType) => ui.listTypeGrid);

  useEffect(() => {
    _addFilterData(true);
    if (category) {
      _getProductsForCategoryOrChild(category);
    }
  }, [_addFilterData, _getProductsForCategoryOrChild, category]);

  const onRowPress = (product: ProductType) => {
    _setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name,
      product: product,
    });
  };

  const onRefresh = () => {
    _updateProductsForCategoryOrChild(category, true);
  };

  const onEndReached = () => {
    console.log('On end reached called!');
    console.log(loadingMore, totalCount, canLoadMoreContent);
    if (!loadingMore && canLoadMoreContent && category) {
      _getProductsForCategoryOrChild(
        category,
        products?.length,
        sortOrder,
        priceFilter,
      );
    }
  };

  const performSort = (_sortOrder: number) => {
    _addFilterData(_sortOrder);
    if (category) {
      _getProductsForCategoryOrChild(
        category,
        undefined,
        _sortOrder,
        priceFilter,
      );
    }
  };

  return (
    <View style={styles.containerStyle(theme)}>
      <ProductList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        products={products ?? []}
        onEndReached={onEndReached}
        canLoadMoreContent={canLoadMoreContent}
        onRowPress={onRowPress}
        navigation={navigation}
        gridColumnsValue={listTypeGrid}
        performSort={performSort}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
      />
    </View>
  );
};

// @ts-ignore
Category.navigationOptions = ({ navigation }: { navigation: any }) => ({
  title: navigation.state.params.title.toUpperCase(),
  headerBackTitle: ' ',
  headerRight: () => <HeaderGridToggleIcon />,
});

const styles = {
  containerStyle: (theme: ThemeType) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
};

export default connector(Category);

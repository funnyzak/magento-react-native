import React, { useEffect, useContext, FC } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text } from '../common';
import { logout, currentCustomer } from '../../actions';
import {
  NAVIGATION_ORDERS_PATH,
  NAVIGATION_ADDRESS_SCREEN_PATH,
} from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { CustomerType } from '../../magento/types';
import { StoreStateType } from "../../reducers";

const Account: FC<{
  customer: CustomerType | null;
  navigation: any;
  currentCustomer: typeof currentCustomer;
  logout: typeof logout;
}> = ({
  customer = null,
  navigation,
  currentCustomer: _currentCustomer,
  logout: _logout,
}) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    // ComponentDidMount
    if (!customer) {
      _currentCustomer();
    }
  }, [_currentCustomer, customer]);

  const onLogoutPress = () => {
    _logout();
  };

  const renderCustomerData = () => {
    if (!customer) {
      return (
        <ActivityIndicator
          size="large"
          color={theme.colors.secondary}
          style={styles.activity(theme)}
        />
      );
    }

    const { email, firstname, lastname } = customer;
    return (
      <View style={styles.textContainer(theme)}>
        <Text bold type="subheading" style={styles.center}>
          {translate('account.contactInformation')}
        </Text>
        <Text style={styles.center}>
          {firstname} {lastname}
        </Text>
        <Text style={styles.center}>{email}</Text>
      </View>
    );
  };

  const openOrders = () => {
    navigation.navigate(NAVIGATION_ORDERS_PATH);
  };

  const openAddAddress = () => {
    navigation.navigate(NAVIGATION_ADDRESS_SCREEN_PATH);
  };

  return (
    <View style={styles.container(theme)}>
      {renderCustomerData()}
      <Button onPress={onLogoutPress}>
        {translate('account.logoutButton')}
      </Button>
      <Button onPress={openOrders} style={styles.buttonMargin(theme)}>
        {translate('account.myOrdersButton')}
      </Button>
      <Button onPress={openAddAddress} style={styles.buttonMargin(theme)}>
        {translate('account.myAddressButton')}
      </Button>
    </View>
  );
};

Account.navigationOptions = {
  title: translate('account.title'),
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.spacing.large,
  }),
  activity: theme => ({
    padding: theme.spacing.large,
  }),
  center: {
    textAlign: 'center',
  },
  textContainer: theme => ({
    marginBottom: theme.spacing.large,
  }),
  buttonMargin: theme => ({
    marginTop: theme.spacing.large,
  }),
});

const mapStateToProps = ({ account }: StoreStateType) => {
  const { customer } = account;
  return { customer };
};

export default connect(mapStateToProps, { logout, currentCustomer })(Account);

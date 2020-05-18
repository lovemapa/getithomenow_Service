'use strict';
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
class payment {
    makePayment(data) {

        return new Promise((resolve, reject) => {
            var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
            merchantAuthenticationType.setName("7XG8Bwc8h");
            merchantAuthenticationType.setTransactionKey("827NB229bbHqQTrb");

            var creditCard = new ApiContracts.CreditCardType();
            creditCard.setCardNumber(data.cardNumber);
            creditCard.setExpirationDate(data.expirationDate);
            creditCard.setCardCode(data.cardCode);

            var paymentType = new ApiContracts.PaymentType();
            paymentType.setCreditCard(creditCard);

            var orderDetails = new ApiContracts.OrderType();
            orderDetails.setInvoiceNumber(data.invoiceNumber);
            orderDetails.setDescription(data.description);

            // var tax = new ApiContracts.ExtendedAmountType();
            // tax.setAmount('4.26');
            // tax.setName('level2 tax name');
            // tax.setDescription('level2 tax');

            // var duty = new ApiContracts.ExtendedAmountType();
            // duty.setAmount('8.55');
            // duty.setName('duty name');
            // duty.setDescription('duty description');

            var shipping = new ApiContracts.ExtendedAmountType();
            shipping.setAmount('0.0');
            shipping.setName('shipping name');
            shipping.setDescription('shipping description');

            var billTo = new ApiContracts.CustomerAddressType();
            billTo.setFirstName(data.billFirstName);
            billTo.setLastName(data.billLastName);
            billTo.setCompany(data.billCompanyName);
            billTo.setAddress(data.billAddress);
            billTo.setCity(data.billCity);
            billTo.setState(data.billState);
            billTo.setZip(data.billZip);
            billTo.setCountry(data.billCountry);

            var shipTo = new ApiContracts.CustomerAddressType();
            shipTo.setFirstName(data.shipFirstName);
            shipTo.setLastName(data.shipLastName);
            shipTo.setCompany(data.shipCompanyName);
            shipTo.setAddress(data.shipAddress);
            shipTo.setCity(data.shipCity);
            shipTo.setState(data.shipState);
            shipTo.setZip(data.shipzip);
            shipTo.setCountry(data.shipCountry);

            var lineItem_id1 = new ApiContracts.LineItemType();
            lineItem_id1.setItemId(data.itemId);
            lineItem_id1.setName(data.itemName);
            lineItem_id1.setDescription(data.itemDescription);
            lineItem_id1.setQuantity(data.itemQuantity);
            lineItem_id1.setUnitPrice(data.itemUnitPrice);

            // var lineItem_id2 = new ApiContracts.LineItemType();
            // lineItem_id2.setItemId('2');
            // lineItem_id2.setName('vase2');
            // lineItem_id2.setDescription('cannes logo2');
            // lineItem_id2.setQuantity('28');
            // lineItem_id2.setUnitPrice('25.00');

            var lineItemList = [];
            lineItemList.push(lineItem_id1);
            // lineItemList.push(lineItem_id2);

            var lineItems = new ApiContracts.ArrayOfLineItem();
            lineItems.setLineItem(lineItemList);

            var userField_a = new ApiContracts.UserField();
            userField_a.setName('A');
            userField_a.setValue('Aval');

            var userField_b = new ApiContracts.UserField();
            userField_b.setName('B');
            userField_b.setValue('Bval');

            var userFieldList = [];
            userFieldList.push(userField_a);
            userFieldList.push(userField_b);

            var userFields = new ApiContracts.TransactionRequestType.UserFields();
            userFields.setUserField(userFieldList);

            var transactionSetting1 = new ApiContracts.SettingType();
            transactionSetting1.setSettingName('duplicateWindow');
            transactionSetting1.setSettingValue('120');

            var transactionSetting2 = new ApiContracts.SettingType();
            transactionSetting2.setSettingName('recurringBilling');
            transactionSetting2.setSettingValue('false');

            var transactionSettingList = [];
            transactionSettingList.push(transactionSetting1);
            transactionSettingList.push(transactionSetting2);

            var transactionSettings = new ApiContracts.ArrayOfSetting();
            transactionSettings.setSetting(transactionSettingList);

            var transactionRequestType = new ApiContracts.TransactionRequestType();
            transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
            transactionRequestType.setPayment(paymentType);
            transactionRequestType.setAmount(100);
            transactionRequestType.setLineItems(lineItems);
            transactionRequestType.setUserFields(userFields);
            transactionRequestType.setOrder(orderDetails);
            // transactionRequestType.setTax(tax);
            // transactionRequestType.setDuty(duty);
            transactionRequestType.setShipping(shipping);
            transactionRequestType.setBillTo(billTo);
            transactionRequestType.setShipTo(shipTo);
            transactionRequestType.setTransactionSettings(transactionSettings);

            var createRequest = new ApiContracts.CreateTransactionRequest();
            createRequest.setMerchantAuthentication(merchantAuthenticationType);
            createRequest.setTransactionRequest(transactionRequestType);

            //pretty print request
            console.log(JSON.stringify(createRequest.getJSON(), null, 2));

            var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
            //Defaults to sandbox
            //ctrl.setEnvironment(SDKConstants.endpoint.production);

            ctrl.execute(function () {

                var apiResponse = ctrl.getResponse();

                var response = new ApiContracts.CreateTransactionResponse(apiResponse);

                //pretty print response
                resolve(response, null, 2)
                // console.log("THIS", JSON.stringify(response, null, 2));

                if (response != null) {
                    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                        if (response.getTransactionResponse().getMessages() != null) {
                            console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
                            console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
                            console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
                            console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
                        }
                        else {
                            console.log('Failed Transaction.');
                            if (response.getTransactionResponse().getErrors() != null) {
                                console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                                console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                            }
                        }
                    }
                    else {
                        console.log('Failed Transaction. ');
                        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {

                            console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                            console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                        }
                        else {
                            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                            console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                        }
                    }
                }
                else {
                    console.log('Null Response.');
                }

                // callback(response);
            });
        })

    }

    authorizeCreditCard(data) {
        return new Promise((resolve, reject) => {

            var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
            merchantAuthenticationType.setName("7XG8Bwc8h");
            merchantAuthenticationType.setTransactionKey("827NB229bbHqQTrb");

            var creditCard = new ApiContracts.CreditCardType();
            creditCard.setCardNumber('4242424242424242');
            creditCard.setExpirationDate('0822');
            creditCard.setCardCode('999');

            var paymentType = new ApiContracts.PaymentType();
            paymentType.setCreditCard(creditCard);

            var orderDetails = new ApiContracts.OrderType();
            orderDetails.setInvoiceNumber('INV-12345');
            orderDetails.setDescription('Product Description');

            var transactionRequestType = new ApiContracts.TransactionRequestType();
            transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.CAPTUREONLYTRANSACTION);
            transactionRequestType.setPayment(paymentType);
            transactionRequestType.setAmount(utils.getRandomAmount());
            transactionRequestType.setAuthCode('ROHNFQ');
            transactionRequestType.setOrder(orderDetails);

            var createRequest = new ApiContracts.CreateTransactionRequest();
            createRequest.setMerchantAuthentication(merchantAuthenticationType);
            createRequest.setTransactionRequest(transactionRequestType);

            //pretty print request
            console.log(JSON.stringify(createRequest.getJSON(), null, 2));

            var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

            ctrl.execute(function () {

                var apiResponse = ctrl.getResponse();

                var response = new ApiContracts.CreateTransactionResponse(apiResponse);

                //pretty print response
                resolve(response, null, 2);

                if (response != null) {
                    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                        if (response.getTransactionResponse().getMessages() != null) {
                            console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
                            console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
                            console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
                            console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
                        }
                        else {
                            console.log('Failed Transaction.');
                            if (response.getTransactionResponse().getErrors() != null) {
                                console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                                console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                            }
                        }
                    }
                    else {
                        console.log('Failed Transaction. ');
                        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {

                            console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                            console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                        }
                        else {
                            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                            console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                        }
                    }
                }
                else {
                    console.log('Null Response.');
                }

                // callback(response);
            });




            module.exports.captureFundsAuthorizedThroughAnotherChannel = captureFundsAuthorizedThroughAnotherChannel;
        })
    }
}

if (require.main === module) {
    authorizeCreditCard(function () {
        console.log('captureFundsAuthorizedThroughAnotherChannel call complete.');
    });
}

if (require.main === module) {
    makePayment(function () {
        console.log('makePayment call complete.');
    });
}
module.exports = new payment()







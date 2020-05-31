'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class payment {
    makePayment(data) {

        return new Promise(async (resolve, reject) => {
            if (!data.amount || !data.currency)
                reject("Please Provide both amount and currency")



            let amount = data.amount * 100;
            stripe.customers.create({
                email: data.receipt_email, // customer email
                source: data.token // token for the card
            })
                .then(customer =>
                    stripe.charges.create({ // charge the customer
                        amount,
                        description: "Receipt for Getithomenow.com",
                        currency: data.currency,
                        customer: customer.id
                    }))
                .then(charge =>
                    resolve(charge)).catch(err => {
                        reject(err.raw.code)
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
            transactionRequestType.setAmount('100');
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







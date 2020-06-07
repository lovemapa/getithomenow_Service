'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const commonController = require('../../common/controllers/commonController')
const bookingModel = require('../../../models/bookingModel')
const userModel = require('../../../models/userModel')
const moment = require('moment')
const CONSTANT = require('../../../constant')


class payment {
    makePayment(data) {

        return new Promise(async (resolve, reject) => {
            console.log(data);

            if (data.token) {

                if (!data.amount || !data.currency)
                    reject("Please Provide both amount and currency")

                let amount = data.amount * 100;
                stripe.customers.create({
                    email: data.receipt_email, // customer email
                    phone: data.phone,
                    source: data.token // token for the card
                })
                    .then(customer =>
                        stripe.charges.create({ // charge the customer
                            amount,
                            description: "Receipt for Getithomenow.com",
                            currency: data.currency,
                            customer: customer.id,
                            metadata: { phone: customer.phone }
                        }))
                    .then(async charge => {

                        let user
                        if (data.user)
                            user = await userModel.findOne({ _id: data.user })

                        const booking = new bookingModel({
                            user: user,
                            amount: data.amount,
                            email: charge.receipt_email,
                            chargeId: charge.id,
                            customerId: charge.customer,
                            phone: charge.metadata.phone,
                            billing_details: charge.billing_details,
                            name: charge.source.name,
                            itemList: data.itemList,
                            special_instructions: data.special_instructions,
                            pickUpAddress: data.pickUpAddress,
                            deliveryAddress: data.deliveryAddress,
                            timeSlot: data.timeSlot,
                            time: moment().valueOf()
                        })

                        booking.save({}).then(booked => {

                        }).catch(err => {
                            console.log(err);

                        })
                        resolve(charge)
                    }
                    ).catch(err => {
                        reject(err.raw.code)
                    });

            }
            else {

                let user
                if (data.user)
                    user = await userModel.findOne({ _id: data.user })

                const booking = new bookingModel({
                    user: user,
                    amount: data.amount,
                    email: data.contact_details.email,
                    phone: data.contact_details.phone,
                    name: data.contact_details.name,
                    itemList: data.itemList,
                    special_instructions: data.special_instructions,
                    pickUpAddress: data.pickUpAddress,
                    deliveryAddress: data.deliveryAddress,
                    timeSlot: data.timeSlot,
                    bookingDate: data.bookingDate,
                    rightNow: data.rightNow,
                    date: moment().valueOf()
                })

                booking.save({}).then(booked => {
                    resolve(booked)
                }).catch(err => {
                    console.log(err);
                    reject(err)

                })

            }


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







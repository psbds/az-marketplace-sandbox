import React, { Component } from 'react';
import { CodeBlock } from "../FormInputs";
import SubscriptionService from "../../services/SubscriptionService";
import SettingsService from "../../services/SettingsService";
import OperationService from "../../services/OperationService";
import WithLoading from "hoc/WithLoading";
import WithErrorHandler from "hoc/WithErrorHandler";
import ToastStatus from "../../helpers/ToastStatus";

var Chance = require('chance');

export default class SimulateReinstate extends Component {

    state = {
        loading: true,
        subscription: {},
        operation: {},
        operationResponse: {}
    }

    async componentDidMount() {
        try {
            var subscriptionService = new SubscriptionService();
            var settingsService = new SettingsService();
            var settings = await settingsService.getSettings();
            var subscription = await subscriptionService.get(this.props.id)

            var chance = new Chance();
            var operation = {
                "id": chance.guid(),
                "activityId": chance.guid(),
                "subscriptionId": subscription.id,
                "offerId": subscription.offerId,
                "publisherId": subscription.publisherId,
                "planId": subscription.planId,
                "quantity": subscription.quantity,
                "action": "Reinstate",
                "timeStamp": new Date().toISOString(),
                "status": "Succeeded"
            };
            this.setState({ subscription: subscription, operation: operation, planOptions: settings.plans, loading: false });
        } catch (error) {
            this.setState({ error: error, loading: false });
            console.error(error);
        }
    }

    async submit() {
        this.setState({ loading: true });
        ToastStatus(async () => {
            var operationService = new OperationService();
            await operationService.simulateReinstate(this.state.operation)
            this.props.afterSubmit && this.props.afterSubmit();
            this.setState({ loading: false });
        }, "Request sent sucessfully", "Error Retrieving Data")
            .catch(error => {
                this.setState({ loading: false });
                console.error(error);
            });
    }

    render() {
        return (
            <WithLoading show={!this.state.loading} type="bubbles" color="gray">
                <WithErrorHandler error={this.state.error}>
                    <div>
                        <p>Are you sure you want to change the subscription {this.props.id} ?</p>
                        <h5>Operation Action<hr /></h5>
                        <ol>
                            <li>
                                <p>The Sandbox will create a new operation record with the JSON below.</p>
                                <p>You can query it later using the <a href="/">Operations Get API.</a></p>
                            </li>
                            <li>
                                The Sandbox will call the webhook configured in <a href="/settings" target="_blank">Settings</a>, sending the JSON below.
                            <CodeBlock language="json" text={JSON.stringify(this.state.operation, null, 4)} />
                            </li>
                            <li>The Subscription Status will be set to Subscribed.</li>
                        </ol>
                        <br />
                        <h5>Expected Action<hr /></h5>
                        <p>
                            You should Reinstate the subscription on your SaaS App
                    </p>
                    </div>
                </WithErrorHandler>
            </WithLoading>)
    }
}
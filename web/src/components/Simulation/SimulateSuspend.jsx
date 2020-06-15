import React, { Component } from 'react';
import PropTypes from "prop-types";
import Chance from 'chance';
import { CodeBlock } from "components/FormInputs";
import SubscriptionService from "services/SubscriptionService";
import SettingsService from "services/SettingsService";
import OperationService from "services/OperationService";
import WithLoading from "hoc/WithLoading";
import WithErrorHandler from "hoc/WithErrorHandler";
import ToastStatus from "helpers/ToastStatus";

export default class SimulateSuspend extends Component {

    constructor(props) {
        super(props);
        this.subscriptionService = new SubscriptionService();
        this.settingsService = new SettingsService();
        this.operationService = new OperationService();
    }

    state = {
        loading: true,
        subscription: {},
        operation: {},
        operationResponse: {}
    }

    async componentDidMount() {
        try {
            var settings = await this.settingsService.getSettings();
            var subscription = await this.subscriptionService.get(this.props.id);

            var chance = new Chance();
            var operation = {
                "id": chance.guid(),
                "activityId": chance.guid(),
                "subscriptionId": subscription.id,
                "offerId": subscription.offerId,
                "publisherId": subscription.publisherId,
                "planId": subscription.planId,
                "quantity": subscription.quantity,
                "action": "Suspend",
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
            await this.operationService.simulateSuspend(this.state.operation)
            this.props.afterSubmit && this.props.afterSubmit();
            this.setState({ loading: false });
        }, "Request sent sucessfully", "Error Submitting Data. Check the console for more logs.")
            .catch(error => {
                this.setState({ loading: false });
                console.error(error);
            });
    }

    render() {
        return (
            <WithLoading show={!this.state.loading}>
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
                            <li>The Subscription Status will be set to Suspended.</li>
                        </ol>
                        <br />
                        <h5>Expected Action<hr /></h5>
                        <p>
                            You should suspend the subscription on your SaaS App
                        </p>
                    </div>
                </WithErrorHandler>
            </WithLoading>)
    }
}

SimulateSuspend.propTypes = {
    id: PropTypes.number,
    afterSubmit: PropTypes.func
}
import React from 'react';
import Button from "react-bootstrap/Button";
import SimpleReactValidator from 'simple-react-validator';
import ToastStatus from "helpers/ToastStatus";
import { TextInput } from "components/FormInputs";
import SettingService from "services/SettingsService";
import SettingsPlans from "./SettingsPlans";
import WithLoading from "hoc/WithLoading";
import WithErrorHandler from "hoc/WithErrorHandler";

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.settingsService = new SettingService();
        this.validator = new SimpleReactValidator();
    }

    state = {
        error: null,
        loading: true,
        settings: {
            landingPageUrl: "",
            webhookUrl: "",
            publisherId: "",
            offerId: "",
            beneficiaryTenantId: "",
            purchaserTenantId: "",
            plans: []
        }
    }

    componentDidMount() {
        ToastStatus(async () => {
            var settings = await this.settingsService.getSettings();
            this.setState({ settings: settings, loading: false });
        }, null, "Error Retrieving Data")
            .catch(error => {
                this.setState({ error: error, loading: false });
                console.error(error);
            });
    }

    inputChangeHandler(property, event) {
        var settings = { ...this.state.settings };
        settings[property] = event.target.value;
        this.setState({ settings: settings });
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.validator.allValid()) {
            this.setState({ loading: true });
            await ToastStatus(async () => {
                var service = new SettingService();
                await service.postSettings(this.state.settings);
                this.setState({ loading: false });
            }, "Request sent sucessfully", "Error Submitting Data. Check the console for more logs.")
        } else {
            this.setState({ loading: false });
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    onPlanChangeHandler(plans) {
        var settings = { ...this.state.settings };
        settings.plans = plans;
        this.setState({ settings });
    }

    render() {

        return (<div className="Settings">
            <WithLoading show={!this.state.loading}>
                <WithErrorHandler error={this.state.error}>
                    <form onSubmit={this.handleSubmit.bind(this)}>

                        <div className="col-xs-12 col-sm-12 col-md-6">
                            <TextInput name="landingPageUrl" displayName="Landing Page Url" placeholder="https://mywebsite.com" value={this.state.settings.landingPageUrl} onChangeHandler={(event) => this.inputChangeHandler("landingPageUrl", event)} validator={this.validator} validatorOptions="required" />
                            <TextInput name="webhookUrl" displayName="Webhook Url" placeholder="https://mywebsite.com/webhook" value={this.state.settings.webhookUrl} onChangeHandler={(event) => this.inputChangeHandler("webhookUrl", event)} validator={this.validator} validatorOptions="required" />
                            <TextInput name="publisherId" displayName="Publisher Id" placeholder="contosto_id" value={this.state.settings.publisherId} onChangeHandler={(event) => this.inputChangeHandler("publisherId", event)} validator={this.validator} validatorOptions="required" />
                            <TextInput name="offerId" displayName="Offer Id" placeholder="offer_id" value={this.state.settings.offerId} onChangeHandler={(event) => this.inputChangeHandler("offerId", event)} validator={this.validator} validatorOptions="required" />
                            <TextInput name="beneficiaryTenantId" displayName="Beneficiary Tenant Id" value={this.state.settings.beneficiaryTenantId} onChangeHandler={(event) => this.inputChangeHandler("beneficiaryTenantId", event)} validator={this.validator} validatorOptions="required" />
                            <TextInput name="purchaserTenantId" displayName="Purchase Tenant Id" value={this.state.settings.purchaserTenantId} onChangeHandler={(event) => this.inputChangeHandler("purchaserTenantId", event)} validator={this.validator} validatorOptions="required" />
                        </div>

                        <div className="col-xs-12 col-sm-12">
                            <h5>Plans</h5>
                            <hr />
                            <SettingsPlans plans={this.state.settings.plans} onPlanChange={this.onPlanChangeHandler.bind(this)} />
                            <hr />
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </WithErrorHandler>
            </WithLoading>
        </div >)
    }
}
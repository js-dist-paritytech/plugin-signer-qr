'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _class, _class2, _temp2; // Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

var _react = require('react');var _react2 = _interopRequireDefault(_react);
var _mobxReact = require('mobx-react');
var _propTypes = require('prop-types');var _propTypes2 = _interopRequireDefault(_propTypes);
var _reactIntl = require('react-intl');

var _qrscan = require('@parity/shared/lib/util/qrscan');
var _Button = require('@parity/ui/lib/Button');var _Button2 = _interopRequireDefault(_Button);
var _Form = require('@parity/ui/lib/Form');var _Form2 = _interopRequireDefault(_Form);
var _IdentityIcon = require('@parity/ui/lib/IdentityIcon');var _IdentityIcon2 = _interopRequireDefault(_IdentityIcon);
var _QrCode = require('@parity/ui/lib/QrCode');var _QrCode2 = _interopRequireDefault(_QrCode);
var _QrScan = require('@parity/ui/lib/QrScan');var _QrScan2 = _interopRequireDefault(_QrScan);
var _mobx = require('@parity/mobx');var _mobx2 = _interopRequireDefault(_mobx);

var _ConfirmViaQr = require('./ConfirmViaQr.css');var _ConfirmViaQr2 = _interopRequireDefault(_ConfirmViaQr);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}

var QR_VISIBLE = 1;
var QR_SCAN = 2;
var QR_COMPLETED = 3;var


ConfirmViaQr = (0, _mobxReact.observer)(_class = (_temp2 = _class2 = function (_Component) {_inherits(ConfirmViaQr, _Component);function ConfirmViaQr() {var _ref;var _temp, _this, _ret;_classCallCheck(this, ConfirmViaQr);for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ConfirmViaQr.__proto__ || Object.getPrototypeOf(ConfirmViaQr)).call.apply(_ref, [this].concat(args))), _this), _this.











    netVersionStore = _mobx2.default.net.version().get(_this.context.api), _this.

    state = {
      qrState: QR_VISIBLE,
      qr: {} }, _this.



































































































    onScan = function (signature) {var
      api = _this.context.api;var
      request = _this.props.request;var
      qr = _this.state.qr;

      if (!signature) {
        return;
      }

      if (signature && signature.substr(0, 2) !== '0x') {
        signature = '0x' + signature;
      }

      _this.setState({ qrState: QR_COMPLETED });

      if (qr.tx) {var
        netVersion = _this.netVersionStore.netVersion;var
        tx = qr.tx;var _createSignedTx =
        (0, _qrscan.createSignedTx)(netVersion, signature, tx),rlp = _createSignedTx.rlp;

        return api.signer.confirmRequestRaw(request.id, rlp);
      } else {
        // TODO This is not working
        // I get a "Invalid Transaction" error on the phone, for both eth_sign
        // and parity_decryptMessage. -Amaury 27.02.2018
        return api.signer.confirmRequestRaw(request.id, qr.signature);
      }
    }, _this.

    onConfirm = function () {var
      qrState = _this.state.qrState;

      if (qrState !== QR_VISIBLE) {
        return;
      }

      _this.setState({ qrState: QR_SCAN });
    }, _this.

    generateQr = function () {var
      api = _this.context.api;var _this$props =
      _this.props,request = _this$props.request,transaction = _this$props.transaction;var
      netVersion = _this.netVersionStore.netVersion;var _request$payload =

      request.payload,sign = _request$payload.sign,decrypt = _request$payload.decrypt;
      var setState = function setState(qr) {
        _this.setState({ qr: qr });
      };

      if (transaction) {
        if (!netVersion) {
          return;
        } // The subscribeNonce timer will re-run until netVersion is set
        (0, _qrscan.generateTxQr)(api, netVersion, transaction).then(setState);
        return;
      }

      if (decrypt) {
        (0, _qrscan.generateDecryptQr)(decrypt.msg).then(setState);
        return;
      }

      (0, _qrscan.generateDataQr)(sign.data).then(setState);
    }, _this.

















    readNonce = function () {var
      api = _this.context.api;var _this$props2 =
      _this.props,address = _this$props2.address,request = _this$props2.request,transaction = _this$props2.transaction;var
      qr = _this.state.qr;

      if ((request.payload.sign || request.payload.decrypt) && qr && !qr.value) {
        _this.generateQr();
        return;
      }

      if (!address || !api.transport.isConnected || !transaction) {
        return;
      }

      return api.parity.nextNonce(address).then(function (newNonce) {var
        nonce = _this.state.qr.nonce;

        if (!nonce || !newNonce.eq(nonce)) {
          _this.generateQr();
        }
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);}_createClass(ConfirmViaQr, [{ key: 'componentWillMount', value: function componentWillMount() {this.readNonce();this.subscribeNonce();} }, { key: 'componentWillUnmount', value: function componentWillUnmount() {this.unsubscribeNonce();} }, { key: 'render', value: function render() {var _props = this.props,address = _props.address,isDisabled = _props.isDisabled;var confirmText = this.renderConfirmText();var confirmButton = confirmText ? _react2.default.createElement('div', null, _react2.default.createElement(_Button2.default, { className: _ConfirmViaQr2.default.confirmButton, isDisabled: isDisabled, fullWidth: true, icon: _react2.default.createElement(_IdentityIcon2.default, { address: address, button: true, className: _ConfirmViaQr2.default.signerIcon }), label: confirmText, onClick: this.onConfirm })) : null;return _react2.default.createElement('div', { className: _ConfirmViaQr2.default.confirmForm }, _react2.default.createElement(_Form2.default, null, this.renderQrCode(), this.renderQrScanner(), this.renderHint(), confirmButton));} }, { key: 'renderConfirmText', value: function renderConfirmText() {var qrState = this.state.qrState;if (qrState === QR_VISIBLE) {return _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'signer.txPendingConfirm.buttons.scanSigned', defaultMessage: 'Scan Signed QR' });}return null;} }, { key: 'renderHint', value: function renderHint() {var qrState = this.state.qrState;switch (qrState) {case QR_VISIBLE:return _react2.default.createElement('div', { className: _ConfirmViaQr2.default.passwordHint }, _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'signer.sending.external.scanTx', defaultMessage: 'Please scan the transaction QR on your external device' }));case QR_SCAN:return _react2.default.createElement('div', { className: _ConfirmViaQr2.default.passwordHint }, _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'signer.sending.external.scanSigned', defaultMessage: 'Scan the QR code of the signed transaction from your external device' }));case QR_COMPLETED:default:return null;}} }, { key: 'renderQrCode', value: function renderQrCode() {var _state = this.state,qrState = _state.qrState,qr = _state.qr;if (qrState !== QR_VISIBLE || !qr.value) {return null;}return _react2.default.createElement(_QrCode2.default, { className: _ConfirmViaQr2.default.qr, value: qr.value });} }, { key: 'renderQrScanner', value: function renderQrScanner() {var qrState = this.state.qrState;if (qrState !== QR_SCAN) {return null;}return _react2.default.createElement(_QrScan2.default, { className: _ConfirmViaQr2.default.camera, onScan: this.onScan });} }, { key: 'subscribeNonce', value: function subscribeNonce() {var nonceTimerId = setInterval(this.readNonce, 1000);this.setState({ nonceTimerId: nonceTimerId });} }, { key: 'unsubscribeNonce', value: function unsubscribeNonce() {var nonceTimerId = this.state.nonceTimerId;if (!nonceTimerId) {return;}clearInterval(nonceTimerId);} }]);return ConfirmViaQr;}(_react.Component), _class2.contextTypes = { api: _propTypes2.default.object.isRequired }, _class2.propTypes = { address: _propTypes2.default.string.isRequired, isDisabled: _propTypes2.default.bool, request: _propTypes2.default.object.isRequired, transaction: _propTypes2.default.object }, _temp2)) || _class;exports.default =


ConfirmViaQr;
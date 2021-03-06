import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const locale = {
  // 共同信息
  'load.nodata': 'No upload file',
  'confirm.title': 'Tips',
  'confirm.ok': 'OK',
  'confirm.cancel': 'Cancel',
  'nospace.confirm.cancel1': 'Wait',
  'nospace.confirm.gobuy1': 'Activate Cloud Storage',
  'nospace.confirm.message1': 'The cloud space you activated has expired and the current effective space is 0. Please activate it before using it.',
  'nospace.confirm.message2': 'Part of the cloud space you activated has expired and the current remaining space is not enough to use. Please activate more space before using.',
  'nospace.confirm.message3': 'You have not activated cloud space. Please activate it first before uploading the file.',
  'nospace.confirm.cancel3': 'Wait',
  'nospace.confirm.gobuy3': 'Activate Cloud Storage',
  // 分页信息
  'pagination.info.total': 'Total {0} records',
  // Home内容
  'home.text.1.1': 'Filebox',
  'home.text.1.2': 'IPFS data storage platform',
  'home.text.1.3': 'Filebox provides you with network backup and sharing services for files. It is a dedicated IPFS data center, featuring fast file upload and download speeds, safe and stable, and more. We are not only free, you only need to pledge Filenet tokens, and you can also get additional tokens. reward. Come join FileBox together！',
  'home.button.buy': 'Activate cloud Storage',
  'home.text.2.1': 'What are the benefits of using Filebox?',
  'home.text.2.2.1': 'IPFS dedicated data center',
  'home.text.2.2.2': 'No need to build an IPFS network node by yourself, users can easily run IPFS',
  'home.text.2.3.1': 'Fast upload and download speed',
  'home.text.2.3.2': 'Use distributed storage, fragmented transmission',
  'home.text.2.4.1': 'Data Security',
  'home.text.2.4.2': 'Data is permanently saved and will not be deleted',
  'home.text.2.5.1': 'Mortgage storage',
  'home.text.2.5.2': 'Storage only needs to mortgage Filenet tokens and return them upon expiration',
  'home.text.3.1': 'How to use Filebox?',
  'home.text.3.2': 'Import keystore and password',
  'home.text.3.3': 'Avtivate cloud storage by staking tokens',
  'home.text.3.4': 'Upload Files',
  'home.modal.login.title': 'Tips',
  'home.modal.login.content': 'You have not logged in, please log in first and then activate',
  'home.modal.login.button.login': 'Login now',
  'home.modal.login.button.cancel': 'No login',
  'header.title': 'Filebox cloud disk',
  'header.topmenu.center': 'Personal center',
  'header.topmenu.account': 'Account information',
  'header.topmenu.logout': 'Logout',
  // 关于我们
  'about.title': 'About us',
  'about.text.1': 'Filebox is the first distributed storage cloud platform based on the Filenet mainnet. The technology team comes from the IPFS developer community in Europe, Russia and Silicon Valley. It consists of a total of 120 people. It is based on the Filenet mainnet technology and IPFS transmission protocol to provide users with personal data storage and sharing needs.',
  'about.text.2.1': 'We welcome excellent people to join us together and become a member of Filebox, jointly build a distributed storage cloud platform and provide better quality product services for global users.',
  'about.text.2.2': 'Contact us: contact@filebox.plus',
  // 云空间购买
  'buy.back': '<< Return',
  'buy.title.buy': 'Cloud space activate',
  'buy.title.expansion': 'Cloud space expansion',
  'buy.title.message.prefix': 'Current space capacity：',
  'buy.item.space': 'Cloud space',
  'buy.item.time': 'Staking duration',
  'buy.item.time.unit-single': 'month',
  'buy.item.time.unit': 'months',
  'buy.item.percentage': 'Reward token ratio',
  'buy.item.price': 'Total number of pledged tokens',
  'buy.message.detail': 'Rule of activity',
  'buy.message.price': 'Tips：',
  'buy.submit': 'Activate now',
  'buy.submit2': 'Confirm',
  'buy.rule.detail.title': 'Staking FN to Activate Cloud Space and Get Reward-Event Rules',
  'buy.rule.detail.item.1': '1. Time:',
  'buy.rule.detail.item.2': '2. Rules:',
  'buy.rule.detail.item.3': '3. Staking standard:',
  'buy.rule.detail.item.4': '4. Reward:',
  'buy.rule.detail.item.5': '5. How to attend:',
  'buy.rule.detail.content.1': 'from August 1, 2020 to July 30, 2021',
  'buy.rule.detail.content.2': 'Users stake FN tokens to activate Filebox cloud space and get the FN tokens as reward.',
  'buy.rule.detail.content.3': 'Staking standard: Every 1G cloud space requires staking 0.2FN and you can choose 6 months or 12 months as the staking duration. The staking tokens will be returned to your original account when expired.',
  'buy.rule.detail.content.4': 'If you stake FN tokens for 6 months, you will get 1% as reward. 1/180 of the total reward will be released every day. If you stake FN tokens for 12 months, you will get 3% as reward. 1/365 of the total reward will be released every day. 0.1FN will be charged when you withdraw tokens.',
  'buy.rule.detail.content.5.1': '(1) Use the keystore and password of the Filenet wallet or ZTiao DAPP to log in to the Filebox.',
  'buy.rule.detail.content.5.2': '(2) Activate cloud space by staking FN token.',
  'buy.rule.detail.content.5.3': '(3) The rewards will be released on the second day after the staking, and you can withdraw the rewards to the wallet address of this account.',
  'buy.validate.space.error': 'Please select cloud size',
  'buy.validate.space.max': 'Cloud size is too large, please re-enter it',
  'buy.validate.time.error': 'Please select the pledge duration',
  'buy.modal.password.title': 'Please enter the password',
  'buy.modal.password.content': 'Please enter the Keystore password to confirm your identity',
  'buy.modal.password.placeholder': 'Password',
  'buy.modal.password.button.enter': 'OK',
  'buy.modal.password.button.cancel': 'Cancel',
  'buy.order.success': 'Block transfer is in progress, please check the order later...',
  'buy.validate.password.blank': 'Please enter the password',
  'buy.validate.password.error': 'Password is incorrect, please confirm and try again',
  // 我的文件-菜单
  'menu.myfile': 'My Files',
  'menu.hashsearch': 'Hash Search',
  'menu.myreward': 'Rewards',
  'menu.mycenter': 'User',
  'menu.uploadimg': 'Upload image',
  // 个人中心
  'mycenter.line1': 'Filebox',
  'mycenter.line2': 'Exclusive access to all advanced features',
  'mycenter.button': 'Activate now',
  'mycenter.button2': 'Expansion',
  'mycenter.item.1': 'Order',
  'mycenter.item.2': 'My Space',
  'mycenter.item.3': 'Account information',
  'mycenter.item.4': 'Language settings',
  'mycenter.item.5': 'Sign out',
  'mycenter.item.6': 'About us',
  // 语言
  'lang.title': 'Language settings',
  'lang.chinese': 'Chinese Simplified',
  'lang.english': 'English',
  // /////
  'menu.uploadfile': 'Upload files',
  'menu.myorder': 'Order',
  'menu.myspace': 'My Space',
  'menu.volume.info': 'Used{0}/{1}',
  'menu.volume.expand': 'Expansion',
  'menu.volume.buy': 'Activate now',
  // 登录
  'login': 'Login',
  'login.left.header': 'You are welcome to login!',
  'login.left.content': 'Login instructions：<br />1.Use the keystore and password of the filenet wallet or note to log in to the account.<br />2.If you do not have an account, please create a wallet or note registration account in the filenet wallet app.',
  'login.back': '<< Return',
  'login.keystore': 'Keystore',
  'login.keystorepassword': 'Keystore password',
  'login.keystore.placeholder': 'Please enter keystore',
  'login.keystorepassword.placeholder': 'Please enter the keystore password',
  'login.logininfo': '* You have read and agreed to the ,user service agreement, and ,privacy agreement,',
  'login.mobile.logininfo': 'I have read carefully and agree to the ,user service agreement, and ,privacy agreement,',
  'login.submit': 'Login',
  'login.validate.keystore.blank': 'Keystore cannot be empty',
  'login.validate.password.blank': 'Keystore password cannot be empty',
  'login.validate.keystore.error': 'The keystore or password is incorrect, please confirm and try again',
  'authorization.expired': 'Re-login',
  'authorization.expired.info': 'The login information is incorrect or has expired, please log in again',
  // 用户服务协议
  'agreement.back': '<< Return',
  'agreement.title': 'User Services Agreement',
  'agreement.p1': '1.Before using the services under this agreement, you must carefully read and fully understand the contents of the terms of this agreement, especially the terms of exemption or limitation of liability, the terms of jurisdiction and applicable law, and the opening or use of a product or service Separate agreement. 1.Before using the services under this agreement, you must carefully read and fully understand the contents of the terms of this agreement, especially the terms of exemption or limitation of liability, the terms of jurisdiction and applicable law, and the opening or use of a product or service Separate agreement.1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。',
  'agreement.p2': '2.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。',
  'agreement.p3': '3.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。',
  // 隐私协议
  'privacy.back': '<< Return',
  'privacy.title': 'Privacy Agreement',
  'privacy.p1': '1.Before using the services under this agreement, you must carefully read and fully understand the contents of the terms of this agreement, especially the terms of exemption or limitation of liability, the terms of jurisdiction and applicable law, and the opening or use of a product or service Separate agreement.1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。',
  'privacy.p2': '2.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。',
  'privacy.p3': '3.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。1.在使用本协议项下服务前，请贵方务必先仔细阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，以及开通或使用某项产品或服务的单独协议。',
  // 我的文件
  'myfile.title': 'My Files',
  // ////////
  // 文件传输列表
  'transportfilelist.title': 'Upload list',
  'transportfilelist.title.cancel': 'Cancel',
  'transportfilelist.tab.download': 'Download list',
  'transportfilelist.tab.upload': 'Upload list',
  'transportfilelist.tab.uploading': 'Uploading',
  'transportfilelist.tab.uploaded': 'Upload completed',
  'transportfilelist.tab.pause': 'Pause all',
  'transportfilelist.tab.start': 'Continue all',
  'transportfilelist.tab.downloading': 'Downloading',
  'transportfilelist.tab.downloaded': 'Download completed',
  // 文件搜索
  'filesearch.input.search.tip': 'Please enter a file name',
  'filesearch.input.hashsearch.tip': 'Enter IPFS hash',
  'filesearch.cancel.text': 'Cancel',
  'filesearch.result.info': 'Search results({0})',
  'filesearch.result.hash.info': 'Search results',
  'filesearch.menu.download': 'Download',
  'filesearch.menu.copyipfs': 'Copy IPFS',
  'filesearch.menu.copydownloadurl': 'Files link',
  'filesearch.menu.delete': 'Delete',
  'filesearch.delete.confirm.title': 'Confirm deletion?',
  'filesearch.delete.confirm.text': 'Cannot be restored after deletion',
  'filesearch.delete.finished.text': 'File deleted',
  'filesearch.copy.success': 'Copy success',
  // //////
  'myfile.label.actions': 'Bulk operations：',
  'myfile.button.del': 'Delete',
  'myfile.button.download': 'Download',
  'myfile.table.more.copyIpfs': 'Copy IPFS',
  'myfile.table.more.copyDownloadUrl': 'Copy download link',
  'myfile.table.col.fileName': 'File name',
  'myfile.table.col.fileSize': 'File size',
  'myfile.table.col.entryLoginDate': 'Upload date',
  'myfile.table.col.action': 'Operational',
  'myfile.table.col.uploadPercentage': 'Upload progress',
  'myfile.delete.noFile.message': 'Please select a file to delete.',
  'myfile.download.noFile.message': 'Please select a file to download.',
  'myfile.download.fail.message': 'The file {0} failed to download. Please try again later.',
  'myfile.download.finish.message': 'Download successful',
  'myfile.confirm.delete.message': 'Are you sure to delete the selected file?',
  'myfile.download.loading.message': '【{0}】Downloading file transfer...',
  // 上传文件
  'uploadfile.table.nofile.message': 'Drag your file to the "drag and drop" location or click the "Upload File" button to start uploading the file.',
  'uploadfile.droparea.message': 'Drag files here',
  'uploadfile.modal.login.title': 'Tips',
  'uploadfile.modal.login.button.ok': 'Activate Cloud Storage',
  'uploadfile.modal.login.button.cancel': 'Wait',
  'uploadfile.modal.nospace.content': 'The cloud space you activated has expired and the current effective space is 0. Please activate it before using it.',
  'uploadfile.modal.noenoughspace.content': 'Part of the cloud space you activated has expired and the current remaining space is not enough to use. Please activate more space before using.',
  'uploadfile.modal.noenoughspace.content1': 'The cloud space size is not enough,please expand the capacity after uploading.',
  'uploadfile.table.maxcount': '5',
  'uploadfile.table.total.filename': 'All files',
  'uploadfile.table.upload.button': 'Upload Files',
  'uploadfile.upload.hasFile': 'File already existence',
  'uploadfile.upload.noFile': 'No upload record',
  // 我的奖励
  'myreward.title': 'Rewards',
  'myreward.releasedNumber': 'Released',
  'myreward.toReleaseNumber': 'To be released',
  'myreward.availableNumber': 'Withdrawable:',
  'myreward.totalReward': 'Total Rewards',
  'myreward.withdrawRecord': 'Withdrawal records',
  'myreward.withdrawButton': 'To withdraw>>',
  'myreward.table.col.withdrawTime': 'Time',
  'myreward.table.col.orderID': 'Order ID',
  'myreward.table.col.withdrawAmount': 'Amount',
  'myreward.table.col.status': 'Status',
  'myreward.status.0': 'Withdrawing',
  'myreward.status.1': 'Succeeded',
  'myreward.table.emptytext': 'No withdraw record',
  // 提现
  'withdraw.title': 'Reward withdrawal',
  'withdraw.availableNumber': 'Number of extractable FN:',
  'withdraw.withdrawNumber': 'Number of withdrawals',
  'withdraw.arrivalNumber': 'Actual arrival amount:',
  'withdraw.withdrawButton': 'Withdraw',
  'withdraw.validate.withdrawNumber.space.error': 'Please enter the withdrawal amount',
  'withdraw.validate.withdrawNumber.number.error': 'The actual arrival quantity must be greater than 0',
  'withdraw.validate.withdrawNumber.size.error': 'The withdrawal amount must be less than the withdrawal amount',
  'withdraw.modal.password.title': 'Please enter Keystore password',
  'withdraw.modal.password.button.enter': 'OK',
  'withdraw.modal.password.button.cancel': 'Cancel',
  'withdraw.back': '<< Return',
  'withdraw.withdrawAll': 'All',
  'withdraw.validate.password.blank': 'Please enter the keystore password',
  'withdraw.validate.password.error': 'Keystore password is wrong, please re-enter!',
  'withdraw.cash.success': 'The withdrawal application has been submitted successfully and the transfer is in progress, please check later...',
  'withdraw.input.tip': 'Please enter the withdrawal amount',
  'withdraw.info.title': 'Tips：',
  'withdraw.info.address': 'Withdraw to:',
  'withdraw.info.count': '2.Fuel costs：',
  'withdraw.info.text': 'FN/per',
  'withdraw.input.password.tip': 'Please enter Keystore password',
  // 哈希检索
  'hashsearch.title': 'Hash Search',
  // //////
  'hashsearch.validate.filehash.blank': 'Please enter the IPFS hash',
  'hashsearch.noFile.message': 'The IPFS hash does not exist',
  // 账户信息
  'userinfo.back': '<< Return',
  'userinfo.title': 'Account information',
  'userinfo.label.address': 'Address：',
  'userinfo.label.balance': 'Balance：',
  'userinfo.label.qrcode': 'Wallet address QR code',
  'userinfo.fail.message': 'Failed to obtain information. Try again later.',
  // 我的订单
  'myorder.title': 'Order',
  'myorder.table.col.orderId': 'Order ID',
  'myorder.table.col.createTime': 'Creation time',
  'myorder.table.col.space': 'Storage',
  'myorder.table.col.pledgeFnAmount': 'Total mortgage tokens',
  'myorder.table.col.pledgePeriod': 'Mortgage duration',
  'myorder.table.col.status': 'Trading status',
  'myorder.table.col.action': 'Operational',
  'myorder.table.more.detail': 'Details',
  'myorder.detail.header': 'Order details',
  'myorder.detail.totime': 'Space expiration time',
  'myorder.detail.rewardAmount': 'Number of reward tokens due',
  'myorder.status.0': 'Confirming',
  'myorder.status.1': 'Succeeded',
  'myorder.status.2': 'Failed',
  'myorder.space.unit': 'G',
  'myorder.pledgePeriod.unit': 'Month',
  'myorder.pledgeFnAmount.unit': 'FN',
  'myorder.back': '<< Return',
  'myorder.table.emptytext': 'No order record',
  'myorder.table.up': 'Pull up to see more',
  'myorder.table.nomore': 'Search finished',

  'myspace.header': 'My Space',
  'myspace.space2.header': 'Storage space composition and validity period',
  'myspace.space1.used': 'Used:',
  'myspace.space1.button1': 'Expansion',
  'myspace.space1.button2': 'Activate now',
  'myspace.space2.table.title.space': 'Space',
  'myspace.space2.table.title.totime': 'Expire date',
  'myspace.space2.table.emptytext': 'No record of validity'

}

export default {
  ...components,
  ...locale
}

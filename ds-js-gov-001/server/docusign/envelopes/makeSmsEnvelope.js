const eSignSdk = require('docusign-esign');
const fs = require('fs');
const text = require('../../assets/public/text.json').trafficTicket.envelope;

/**
 * Creates and returns an SMS delivery envelope definition
 * for the police officer.
 */
function makeSmsEnvelope(args) {
  /////////////// Create document for envelope ///////////////
  // Read and create document from file in the local directory
  let docPdfBytes = fs.readFileSync(args.docFile);
  let docb64 = Buffer.from(docPdfBytes).toString('base64');
  let doc = new eSignSdk.Document.constructFromObject({
    documentBase64: docb64,
    name: text.smsDocName, // can be different from actual file name
    fileExtension: 'pdf',
    documentId: '1',
  });

  /////////////// Create signHere tab ///////////////
  let signHere = eSignSdk.SignHere.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    tabLabel: 'signHere',
    xPosition: '123',
    yPosition: '612',
  });

  /////////////// Create fullName tab ///////////////
  let fullName = eSignSdk.FullName.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '155',
    yPosition: '120',
    required: 'true',
    tabLabel: 'fullName',
    height: '12',
    width: '60',
  });

  /////////////// Create dateSigned tab ///////////////
  let dateSigned1 = eSignSdk.DateSigned.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    tabLabel: 'dateSigned1',
    xPosition: '306',
    yPosition: '94',
  });

  let dateSigned2 = eSignSdk.DateSigned.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    tabLabel: 'dateSigned2',
    xPosition: '151',
    yPosition: '196',
  });

  let dateSigned3 = eSignSdk.DateSigned.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    tabLabel: 'dateSigned3',
    xPosition: '93',
    yPosition: '674',
  });

  /////////////// Create attachment tab ///////////////
  let attachmentTab = eSignSdk.SignerAttachment.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '65',
    yPosition: '466',
    optional: 'true',
  });

  /////////////// Create text fields ///////////////
  let time = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '94',
    yPosition: '222',
    required: 'false',
    tabLabel: 'time',
    height: '12',
    width: '70',
  });

  let location = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '64',
    yPosition: '266',
    required: 'false',
    tabLabel: 'location',
    height: '12',
    width: '250',
  });

  let details = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    shared: 'false',
    value: text.smsDescription,
    originalValue: text.smsDescription,
    required: 'true',
    locked: 'false',
    concealValueOnDocument: 'false',
    disableAutoSize: 'false',
    maxLength: '4000',
    tabLabel: 'details',
    font: 'lucidaconsole',
    fontColor: 'black',
    fontSize: 'size9',
    xPosition: '60',
    yPosition: '314',
    width: '550',
    height: '131',
    tabType: 'text',
  });

  /////////////// Create the phone recipient of the envelope ///////////////
  // Create a signer recipient to sign the document with the tabs and phone number
  let signer = eSignSdk.Signer.constructFromObject({
    name: args.signerName,
    recipientId: '1',
    phoneNumber: eSignSdk.RecipientPhoneNumber.constructFromObject({
      countryCode: args.countryCode,
      number: args.phoneNumber,
    }),
    tabs: eSignSdk.Tabs.constructFromObject({
      dateSignedTabs: [dateSigned1, dateSigned2, dateSigned3],
      fullNameTabs: [fullName],
      signerAttachmentTabs: [attachmentTab],
      signHereTabs: [signHere],
      textTabs: [details, location, time],
    }),
  });

  // Add the recipients to the envelope object
  let recipients = eSignSdk.Recipients.constructFromObject({
    signers: [signer],
  });

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  return eSignSdk.EnvelopeDefinition.constructFromObject({
    emailSubject: text.smsEmailSubject,
    documents: [doc],
    status: args.status,
    recipients: recipients,
  });
}

module.exports = {
  makeSmsEnvelope,
};

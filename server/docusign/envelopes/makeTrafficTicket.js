const eSignSdk = require('docusign-esign');
const fs = require('fs');
const text = require('../../assets/public/text.json').trafficTicket;

/**
 * Creates and returns envelope definition for small business loan application.
 */
function makeTrafficTicket(args) {
  let mitigationClerkName = args.mitigationClerkName;
  let contestedClerkName = args.contestedClerkName;
  let fineAmount = 237;
  let fineName = text.envelope.fineName;
  let fineDescription = `$${fineAmount}`;
  let currencyMultiplier = 100;

  /////////////// Create documents for envelope ///////////////
  // Read and create documents from file in the local directory
  let docPdfBytes = fs.readFileSync(args.docFile);
  let docb64 = Buffer.from(docPdfBytes).toString('base64');

  let doc = new eSignSdk.Document.constructFromObject({
    documentBase64: docb64,
    name: text.envelope.ticketDocName, // can be different from actual file name
    fileExtension: 'pdf',
    documentId: '1',
  });

  /////////////// Create initialHere tab ///////////////
  let initialHere = eSignSdk.InitialHere.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    tabLabel: 'initialHere',
    xPosition: '683',
    yPosition: '458',
  });

  /////////////// Create name tabs ///////////////
  let lastName = eSignSdk.LastName.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '363',
    yPosition: '173',
    required: 'true',
    tabLabel: 'lastName',
    height: '12',
    width: '60',
  });

  let firstName = eSignSdk.FirstName.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '484',
    yPosition: '173',
    required: 'true',
    tabLabel: 'firstName',
    height: '12',
    width: '60',
  });

  /////////////// Create text fields ///////////////
  let middleName = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '588',
    yPosition: '173',
    required: 'false',
    tabLabel: 'middleName',
    height: '12',
    width: '80',
  });

  let address = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '39',
    yPosition: '217',
    required: 'false',
    tabLabel: 'address',
    height: '12',
    width: '370',
  });

  let dateOfBirth = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '38',
    yPosition: '259',
    required: 'true',
    tabLabel: 'dateOfBirth',
    height: '12',
    width: '70',
    validationPattern: '^[0-9]{2}/[0-9]{2}/[0-9]{4}$',
    validationMessage: 'Date format: MM/DD/YYYY',
  });

  let race = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '120',
    yPosition: '259',
    required: 'false',
    tabLabel: 'race',
    height: '12',
    width: '65',
  });

  let sex = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '195',
    yPosition: '259',
    required: 'false',
    tabLabel: 'sex',
    height: '12',
    width: '55',
  });

  let height = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '260',
    yPosition: '259',
    required: 'false',
    tabLabel: 'height',
    height: '12',
    width: '60',
  });

  let eyes = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '330',
    yPosition: '259',
    required: 'false',
    tabLabel: 'eyes',
    height: '12',
    width: '60',
  });

  let hair = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '398',
    yPosition: '259',
    required: 'false',
    tabLabel: 'hair',
    height: '12',
    width: '58',
  });

  let homePhone = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '464',
    yPosition: '259',
    required: 'true',
    tabLabel: 'homePhone',
    height: '12',
    width: '145',
    validationPattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$',
    validationMessage: 'Phone # format: XXX-XXX-XXXX',
  });

  let workPhone = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '608',
    yPosition: '259',
    required: 'false',
    tabLabel: 'workPhone',
    height: '12',
    width: '160',
    validationPattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$',
    validationMessage: 'Phone # format: XXX-XXX-XXXX',
  });

  let vehYr = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '260',
    yPosition: '304',
    required: 'false',
    tabLabel: 'vehYr',
    height: '12',
    width: '60',
  });

  let vehMake = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '329',
    yPosition: '304',
    required: 'false',
    tabLabel: 'vehMake',
    height: '12',
    width: '135',
  });

  let vehModel = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '465',
    yPosition: '304',
    required: 'false',
    tabLabel: 'vehModel',
    height: '12',
    width: '145',
  });

  let vehStyle = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '608',
    yPosition: '304',
    required: 'false',
    tabLabel: 'vehStyle',
    height: '12',
    width: '70',
  });

  let vehColor = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '687',
    yPosition: '304',
    required: 'false',
    tabLabel: 'vehColor',
    height: '12',
    width: '70',
  });

  let officerName = eSignSdk.Text.constructFromObject({
    documentId: '1',
    pageNumber: '1',
    xPosition: '258',
    yPosition: '387',
    tabLabel: 'officerName',
    value: text.names.policeName,
  });

  /////////////// Create zip tab ///////////////
  let zip = eSignSdk.Zip.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    useDash4: 'false',
    xPosition: '687',
    yPosition: '218',
    required: 'false',
    tabLabel: 'zip',
    height: '12',
    width: '70',
  });

  /////////////// Create radio tabs ///////////////
  let ticketOptions = eSignSdk.RadioGroup.constructFromObject({
    documentId: '1',
    groupName: 'ticketOption',
    radios: [
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'Pay',
        xPosition: '73',
        yPosition: '451',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'Mitigation',
        xPosition: '223',
        yPosition: '451',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'Contested',
        xPosition: '447',
        yPosition: '451',
        required: 'true',
      }),
    ],
  });

  let radioGroup1 = eSignSdk.RadioGroup.constructFromObject({
    recipientId: '1',
    documentId: '1',
    groupName: 'radioGroup1',
    radios: [
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'Yes',
        xPosition: '254',
        yPosition: '177',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'No',
        xPosition: '288',
        yPosition: '177',
        required: 'true',
      }),
    ],
  });

  let radioGroup2 = eSignSdk.RadioGroup.constructFromObject({
    recipientId: '1',
    documentId: '1',
    groupName: 'radioGroup2',
    radios: [
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'Yes',
        xPosition: '682',
        yPosition: '177',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'No',
        xPosition: '716',
        yPosition: '177',
        required: 'true',
      }),
    ],
  });

  /////////////// Create Payment related tabs ///////////////
  let fineTab = eSignSdk.FormulaTab.constructFromObject({
    documentId: '1',
    pageNumber: '1',
    font: 'helvetica',
    fontSize: 'size11',
    xPosition: '155',
    yPosition: '490',
    tabLabel: 'l1e',
    formula: fineAmount,
    roundDecimalPlaces: '0',
    required: 'true',
    locked: 'true',
    disableAutoSize: 'false',
    conditionalParentLabel: 'ticketOption',
    conditionalParentValue: 'Pay',
  });

  // Payment line item for passport fee
  let paymentLineIteml1 = eSignSdk.PaymentLineItem.constructFromObject({
    name: fineName,
    description: fineDescription,
    amountReference: 'l1e',
  });
  let paymentDetails = eSignSdk.PaymentDetails.constructFromObject({
    gatewayAccountId: args.gatewayAccountId,
    currencyCode: 'USD',
    gatewayName: args.gatewayName,
    gatewayDisplayName: args.gatewayDisplayName,
    lineItems: [paymentLineIteml1],
  });

  // Hidden formula for the payment itself
  let formulaPayment = eSignSdk.FormulaTab.constructFromObject({
    tabLabel: 'payment',
    formula: `[l1e] * ${currencyMultiplier}`,
    roundDecimalPlaces: '0',
    paymentDetails: paymentDetails,
    hidden: 'true',
    required: 'true',
    locked: 'true',
    documentId: '1',
    pageNumber: '1',
    xPosition: '0',
    yPosition: '0',
  });

  /////////////// Create recipients of the envelope ///////////////
  // Create signer recipients to sign the document with the tabs
  let signer1 = eSignSdk.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    recipientId: '1',
    clientUserId: args.signerClientId,
    routingOrder: 1,
    tabs: eSignSdk.Tabs.constructFromObject({
      firstNameTabs: [firstName],
      formulaTabs: [fineTab, formulaPayment],
      initialHereTabs: [initialHere],
      lastNameTabs: [lastName],
      radioGroupTabs: [ticketOptions, radioGroup1, radioGroup2],
      textTabs: [
        address,
        dateOfBirth,
        eyes,
        hair,
        height,
        homePhone,
        middleName,
        officerName,
        sex,
        race,
        vehColor,
        vehMake,
        vehModel,
        vehStyle,
        vehYr,
        workPhone,
      ],
      zipTabs: [zip],
    }),
  });
  let certifiedDeliveryRecipient =
    eSignSdk.CertifiedDelivery.constructFromObject({
      email: 'placeholder@example.com',
      name: 'Approver',
      recipientId: '2',
      routingOrder: 2,
    });

  // Create recipient object
  let recipients = eSignSdk.Recipients.constructFromObject({
    signers: [signer1],
    certifiedDeliveries: [certifiedDeliveryRecipient],
  });

  /////////////// Create conditional recipient related objects ///////////////
  // Create recipientOption and recipientGroup models
  let cdRecipientA = eSignSdk.RecipientOption.constructFromObject({
    email: args.signerEmail,
    name: mitigationClerkName,
    roleName: 'Mitigation Clerk',
    recipientLabel: 'cdRecipientA',
  });
  let cdRecipientB = eSignSdk.RecipientOption.constructFromObject({
    email: args.signerEmail,
    name: contestedClerkName,
    roleName: 'Contested Clerk',
    recipientLabel: 'cdRecipientB',
  });
  let recipientGroup = eSignSdk.RecipientGroup.constructFromObject({
    groupName: 'Court Clerks',
    groupMessage: 'Members of this group approve a workflow',
    recipients: [cdRecipientA, cdRecipientB],
  });

  // Create conditionalRecipientRuleFilter models
  let filter1 = eSignSdk.ConditionalRecipientRuleFilter.constructFromObject({
    scope: 'tabs',
    recipientId: '1',
    tabId: 'ApprovalTab',
    operator: 'equals',
    value: 'Mitigation',
    tabLabel: 'ticketOption',
    tabType: 'radioGroup',
  });
  let filter2 = eSignSdk.ConditionalRecipientRuleFilter.constructFromObject({
    scope: 'tabs',
    recipientId: '1',
    tabId: 'ApprovalTab',
    operator: 'equals',
    value: 'Contested',
    tabLabel: 'ticketOption',
    tabType: 'radioGroup',
  });

  // Create conditionalRecipientRuleCondition models
  let condition1 =
    eSignSdk.ConditionalRecipientRuleCondition.constructFromObject({
      filters: [filter1],
      order: 1,
      recipientLabel: 'cdRecipientA',
    });
  let condition2 =
    eSignSdk.ConditionalRecipientRuleCondition.constructFromObject({
      filters: [filter2],
      order: 2,
      recipientLabel: 'cdRecipientB',
    });

  // Create conditionalRecipientRule model
  let conditionalRecipient =
    eSignSdk.ConditionalRecipientRule.constructFromObject({
      conditions: [condition1, condition2],
      recipientGroup: recipientGroup,
      recipientId: '2',
      order: 0,
    });

  // Create recipientRouting model
  let recipientRouting = eSignSdk.RecipientRouting.constructFromObject({
    rules: eSignSdk.RecipientRules.constructFromObject({
      conditionalRecipients: [conditionalRecipient],
    }),
  });

  // Create a workflow model
  let workflowStep = eSignSdk.WorkflowStep.constructFromObject({
    action: 'pause_before',
    triggerOnItem: 'routing_order',
    itemId: 2,
    recipientRouting: recipientRouting,
  });
  let workflow = eSignSdk.Workflow.constructFromObject({
    workflowSteps: [workflowStep],
  });

  // Request that the envelope be sent by setting status to "sent".
  // To request that the envelope be created as a draft, set status to "created"
  return eSignSdk.EnvelopeDefinition.constructFromObject({
    emailSubject: text.envelope.ticketEmailSubject,
    documents: [doc],
    status: args.status,
    workflow: workflow,
    recipients: recipients,
  });
}
module.exports = {
  makeTrafficTicket,
};

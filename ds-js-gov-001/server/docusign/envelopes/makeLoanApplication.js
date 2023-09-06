const eSignSdk = require('docusign-esign');
const fs = require('fs');
const text = require('../../assets/public/text.json').smallBusinessLoan
  .envelope;

/**
 * Creates and returns envelope definition for small business loan application.
 */
function makeLoanApplicationEnvelope(args) {
  let smallLenderName = args.smallLenderName;
  let bigLenderName = args.bigLenderName;
  let loanBenchmark = args.loanBenchmark;

  /////////////// Create documents for envelope ///////////////
  // Read and create documents from file in the local directory
  let docPdfBytes = fs.readFileSync(args.docFile);
  let doc2DocxBytes = fs.readFileSync(args.doc2File);

  let docb64 = Buffer.from(docPdfBytes).toString('base64');
  let doc2b64 = Buffer.from(doc2DocxBytes).toString('base64');

  let doc = new eSignSdk.Document.constructFromObject({
    documentBase64: docb64,
    name: text.loan1DocName,
    fileExtension: 'pdf',
    documentId: '1',
  });

  let doc2 = new eSignSdk.Document.constructFromObject({
    documentBase64: doc2b64,
    name: text.loan2DocName,
    fileExtension: 'docx',
    documentId: '2',
  });

  /////////////// Create signHere tabs ///////////////
  let signHere1 = eSignSdk.SignHere.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '2',
    tabLabel: 'signHere1',
    xPosition: '117',
    yPosition: '203',
  });

  let signHere2 = eSignSdk.SignHere.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    tabLabel: 'signHere2',
    xPosition: '173',
    yPosition: '335',
  });

  /////////////// Create initialHere tab ///////////////
  let initialHere = eSignSdk.InitialHere.constructFromObject({
    recipientId: '2',
    documentId: '1',
    pageNumber: '2',
    tabLabel: 'initialHere',
    xPosition: '523',
    yPosition: '240',
  });

  /////////////// Create fullName tabs ///////////////
  let fullName1 = eSignSdk.FullName.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '125',
    yPosition: '151',
    required: 'true',
    tabLabel: 'fullName1',
    height: '12',
    width: '60',
  });

  let fullName2 = eSignSdk.FullName.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '2',
    xPosition: '113',
    yPosition: '183',
    required: 'true',
    tabLabel: 'fullName2',
    height: '12',
    width: '60',
  });

  let fullName3 = eSignSdk.FullName.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    xPosition: '149',
    yPosition: '280',
    required: 'true',
    tabLabel: 'fullName3',
    height: '12',
    width: '60',
  });

  /////////////// Create dateSigned tab ///////////////
  let dateSigned1 = eSignSdk.DateSigned.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '2',
    tabLabel: 'dateSigned1',
    xPosition: '401',
    yPosition: '208',
  });

  let dateSigned2 = eSignSdk.DateSigned.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    tabLabel: 'dateSigned2',
    xPosition: '399',
    yPosition: '335',
  });

  /////////////// Create attachment tab ///////////////
  let attachmentTab = eSignSdk.SignerAttachment.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '511',
    yPosition: '626',
    optional: 'true',
  });

  /////////////// Create emailAddress tab ///////////////
  let email = eSignSdk.EmailAddress.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '92',
    yPosition: '270',
    required: 'true',
  });

  /////////////// Create number field /////////////////
  let loanAmount = eSignSdk.ModelNumber.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '190',
    yPosition: '503',
    required: 'true',
    tabLabel: 'loanAmount',
    height: '12',
    width: '60',
    tooltip: text.loanAmountTooltip,
  });

  /////////////// Create text fields /////////////////
  let address = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '102',
    yPosition: '172',
    required: 'false',
    tabLabel: 'address',
    height: '12',
    width: '500',
  });

  let city = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '83',
    yPosition: '196',
    required: 'false',
    tabLabel: 'city',
    height: '12',
    width: '220',
  });

  let state = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '340',
    yPosition: '196',
    required: 'false',
    tabLabel: 'state',
    height: '12',
    width: '230',
  });

  let dateOfBirth = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '373',
    yPosition: '220',
    required: 'false',
    tabLabel: 'dateOfBirth',
    height: '12',
    width: '192',
    validationPattern: '^[0-9]{2}/[0-9]{2}/[0-9]{4}$',
    validationMessage: 'Date format: MM/DD/YYYY',
  });

  let homePhone = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '121',
    yPosition: '245',
    required: 'true',
    tabLabel: 'homePhone',
    height: '12',
    width: '177',
    validationPattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$',
    validationMessage: 'Phone # format: XXX-XXX-XXXX',
  });

  let businessPhone = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '386',
    yPosition: '245',
    required: 'false',
    tabLabel: 'businessPhone',
    height: '12',
    width: '178',
    validationPattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$',
    validationMessage: 'Phone # format: XXX-XXX-XXXX',
  });

  let businessName = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '131',
    yPosition: '294',
    required: 'false',
    tabLabel: 'businessName',
    height: '12',
    width: '220',
  });

  let loanPurpose = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '167',
    yPosition: '526',
    required: 'false',
    tabLabel: 'loanPurpose',
    height: '12',
    width: '400',
  });

  let explanationBox = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '58',
    yPosition: '396',
    required: 'true',
    tabLabel: 'explanation',
    height: '60',
    width: '550',
    conditionalParentLabel: 'radioGroup1',
    conditionalParentValue: 'Yes',
  });

  /////////////// Create zip tab ///////////////
  let zip = eSignSdk.Zip.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    useDash4: 'false',
    xPosition: '83',
    yPosition: '220',
    required: 'false',
    tabLabel: 'zip',
    height: '12',
    width: '220',
  });

  /////////////// Create dropdowns ///////////////
  let numEmployees = eSignSdk.List.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '199',
    yPosition: '319',
    listItems: [
      eSignSdk.ListItem.constructFromObject({
        text: '0-49',
        value: '0-49',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: '50-99',
        value: '50-99',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: '100-249',
        value: '100-249',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: '250-500',
        value: '250-500',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: '500+',
        value: '500+',
      }),
    ],
    required: 'true',
    tabLabel: 'numEmployees',
  });

  let businessType = eSignSdk.List.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '139',
    yPosition: '342',
    listItems: [
      eSignSdk.ListItem.constructFromObject({
        text: 'Agriculture, forestry, fishing and hunting',
        value: 'Agriculture, forestry, fishing and hunting',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: 'Arts, entertainment and recreation',
        value: 'Arts, entertainment and recreation',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: 'Construction and manufacturing',
        value: 'Construction and manufacturing',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: 'Educational services',
        value: 'Educational services',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: 'Finance and insurance',
        value: 'Finance and insurance',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: 'Real estate, rental and leasing',
        value: 'Real estate, rental and leasing',
      }),
      eSignSdk.ListItem.constructFromObject({
        text: 'Other services',
        value: 'Other services',
      }),
    ],
    required: 'true',
    tabLabel: 'businessType',
  });

  /////////////// Create radio tabs ///////////////
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
        xPosition: '463',
        yPosition: '364',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'No',
        xPosition: '498',
        yPosition: '364',
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
        xPosition: '255',
        yPosition: '551',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: 'No',
        xPosition: '292',
        yPosition: '551',
        required: 'true',
      }),
    ],
  });
  /////////////// Create checkboxes ///////////////
  let check1 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '629',
    tabLabel: 'ckBizTaxRets',
  });
  let check2 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '643',
    tabLabel: 'ckPersTaxRets',
  });
  let check3 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '657',
    tabLabel: 'ckLetters',
  });
  let check4 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '672',
    tabLabel: 'ckBizPlan',
  });

  let loanCheck1 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '124',
    tabLabel: 'ckComplete',
  });
  let loanCheck2 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '152',
    tabLabel: 'ckTaxRets',
  });
  let loanCheck3 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '181',
    tabLabel: 'ckLettersGood',
  });
  let loanCheck4 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '210',
    tabLabel: 'ckBankruptcy',
  });
  let loanCheck5 = eSignSdk.Checkbox.constructFromObject({
    recipientId: '2',
    documentId: '2',
    pageNumber: '1',
    xPosition: '73',
    yPosition: '239',
    tabLabel: 'ckCredit',
  });

  /////////////// Create recipients of the envelope ///////////////
  // Create signer recipients to sign the document with the tabs
  let signer1 = eSignSdk.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    recipientId: '1',
    clientUserId: args.signerClientId,
    routingOrder: '1',
    tabs: eSignSdk.Tabs.constructFromObject({
      checkboxTabs: [check1, check2, check3, check4],
      dateSignedTabs: [dateSigned1],
      emailAddressTabs: [email],
      fullNameTabs: [fullName1, fullName2],
      listTabs: [numEmployees, businessType],
      numberTabs: [loanAmount],
      radioGroupTabs: [radioGroup1, radioGroup2],
      signHereTabs: [signHere1],
      signerAttachmentTabs: [attachmentTab],
      textTabs: [
        address,
        city,
        state,
        zip,
        dateOfBirth,
        homePhone,
        businessPhone,
        businessName,
        loanPurpose,
        explanationBox,
      ],
      zipTabs: [zip],
    }),
  });
  let signer2 = eSignSdk.Signer.constructFromObject({
    email: 'placeholder@example.com',
    name: 'Approver',
    recipientId: '2',
    routingOrder: '2',
    tabs: eSignSdk.Tabs.constructFromObject({
      checkboxTabs: [
        loanCheck1,
        loanCheck2,
        loanCheck3,
        loanCheck4,
        loanCheck5,
      ],
      dateSignedTabs: [dateSigned2],
      fullNameTabs: [fullName3],
      initialHereTabs: [initialHere],
      signHereTabs: [signHere2],
    }),
  });

  // Create recipient object
  let recipients = eSignSdk.Recipients.constructFromObject({
    signers: [signer1, signer2],
  });

  /////////////// Create conditional recipient related objects ///////////////
  // Create recipientOption and recipientGroup models
  let signer2a = eSignSdk.RecipientOption.constructFromObject({
    email: args.signerEmail,
    name: smallLenderName,
    roleName: 'Small Lender Signer',
    recipientLabel: 'signer2a',
  });
  let signer2b = eSignSdk.RecipientOption.constructFromObject({
    email: args.signerEmail,
    name: bigLenderName,
    roleName: 'Big Lender Signer',
    recipientLabel: 'signer2b',
  });
  let recipientGroup = eSignSdk.RecipientGroup.constructFromObject({
    groupName: 'Approver',
    groupMessage: 'Members of this group approve a workflow',
    recipients: [signer2a, signer2b],
  });

  // Create conditionalRecipientRuleFilter models
  let filter1 = eSignSdk.ConditionalRecipientRuleFilter.constructFromObject({
    scope: 'tabs',
    recipientId: '1',
    tabId: 'ApprovalTab',
    operator: 'lessThan',
    value: loanBenchmark,
    tabLabel: 'loanAmount',
    tabType: 'number',
  });

  let filter2 = eSignSdk.ConditionalRecipientRuleFilter.constructFromObject({
    scope: 'tabs',
    recipientId: '1',
    tabId: 'ApprovalTab',
    operator: 'greaterThanEquals',
    value: loanBenchmark,
    tabLabel: 'loanAmount',
    tabType: 'number',
  });

  // Create conditionalRecipientRuleCondition models
  let condition1 =
    eSignSdk.ConditionalRecipientRuleCondition.constructFromObject({
      filters: [filter1],
      order: 1,
      recipientLabel: 'signer2a',
    });
  let condition2 =
    eSignSdk.ConditionalRecipientRuleCondition.constructFromObject({
      filters: [filter2],
      order: 2,
      recipientLabel: 'signer2b',
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
    emailSubject: text.loanEmailSubject,
    brandId: args.brandId,
    documents: [doc, doc2],
    status: args.status,
    workflow: workflow,
    recipients: recipients,
    enforceSignerVisibility: true,
  });
}

module.exports = {
  makeLoanApplicationEnvelope,
};

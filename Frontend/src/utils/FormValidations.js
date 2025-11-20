// product eligibility validations
export const validations = (
  data,
  ruleName,
  isUpdate = false,
  existingEntries
) => {
  const errors = [];

  // Safe string conversion helper
  const safe = (val) => String(val ?? "").trim();

  // Regex definitions
  const alpha = /^[A-Za-z\s]+$/; //" must contain only letters"
  const alphanum = /^[A-Za-z0-9\s]+$/; //" must contain only letters, numbers, and spaces"
  const alphanumWithHyphen = /^[A-Za-z0-9\s-]+$/; //" must contain only letters, numbers, spaces, and hyphens"
  const alphaWithHyphen = /^[A-Za-z\s-]+$/; //" must contain only letters, spaces, and hyphens"
  const alphaWithUnderscore = /^[A-Za-z\s_]+$/; //" must contain only letters, spaces, and underscores"
  const digitsOnly = /^[0-9]+$/; //must contain digits only
  const floatNumber = /^\d+(\.\d{1,2})?$/; // must contain a float number with max 2 decimal places

  //product eligibility validation
  if (ruleName === "productEligibility") {
    if (!data.PRODUCT?.trim()) {
      errors.push("Product is required");
    } else if (!alphanumWithHyphen.test(data.PRODUCT)) {
      errors.push(
        "Product must contain only letters, numbers, spaces, and hyphens"
      );
    }

    if (!data.SALES_DESCRIPTION?.trim()) {
      errors.push("Sales Description is required");
    } else if (!alphaWithUnderscore.test(data.SALES_DESCRIPTION)) {
      errors.push(
        "Sales Description must contain only letters, spaces, and underscores"
      );
    }

    if (!data.SERVICE_TYPE?.trim()) {
      errors.push("Service Type is required");
    } else if (!alphaWithHyphen.test(data.SERVICE_TYPE)) {
      errors.push(
        "Service Type must contain only letters, spaces, and hyphens"
      );
    }

    if (!data.ORDER_TYPE?.trim()) {
      errors.push("Order Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_TYPE)) {
      errors.push("Order Type must contain only letters, spaces, and hyphens");
    }
    if (!data.ORDER_SUB_TYPE?.trim()) {
      errors.push("Order Sub Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_SUB_TYPE)) {
      errors.push(
        "Order Sub Type must contain only letters, spaces, and hyphens"
      );
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated user is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated user must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created user is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created user must contain only letters");
      }
    }
    // Duplicate check (only during creation)
    // if (existingEntries) {
    //   const duplicate = existingEntries.some(
    //     (item) => item.PRODUCT === data.PRODUCT
    //   );

    //   if (duplicate) {
    //     errors.push("This Product with the same Product already exists.");
    //   }
    // }

    return errors;
  }

  // slab level validation
  if (ruleName === "slabLevel") {
    if (!data.SLAB_ID?.trim()) {
      errors.push("SLAB ID is required");
    } else if (!digitsOnly.test(data.SLAB_ID)) {
      errors.push("SLAB ID must contain digits only");
    }

    if (!data.SLAB_LEVEL?.trim()) {
      errors.push("Slab level is required");
    } else if (!digitsOnly.test(data.SLAB_LEVEL)) {
      errors.push("Slab level must contain only numbers");
    }

    if (!data.UPPER_RANGE?.trim()) {
      errors.push("Upper Range is required");
    } else if (!floatNumber.test(data.UPPER_RANGE)) {
      errors.push("Upper Range must contain only numbers");
    }

    if (!data.LOWER_RANGE?.trim()) {
      errors.push("Lower Range is required");
    } else if (!floatNumber.test(data.LOWER_RANGE)) {
      errors.push("Lower Range must contain only numbers");
    }

    if (!data.PERCENTAGE?.trim()) {
      errors.push("Percentage is required");
    } else if (!floatNumber.test(data.PERCENTAGE)) {
      errors.push("Percentage must be float value");
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated user is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated user must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created user is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created user must contain only letters");
      }
    }
    // Duplicate check (only during creation)
    if (existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.SLAB_ID === data.SLAB_ID
      );

      if (duplicate) {
        errors.push("This SLAB with the same SLAB ID already exists.");
      }
    }

    return errors;
  }
  // payment stages validations
  if (ruleName === "paymentStages") {
    if (!safe(data.STAGE_ID)) {
      errors.push("Stage ID is required");
    } else if (!digitsOnly.test(safe(data.STAGE_ID))) {
      errors.push("Stage ID must contain digits only");
    }

    if (!safe(data.STAGE_LEVEL)) {
      errors.push("Stage level is required");
    } else if (!digitsOnly.test(safe(data.STAGE_LEVEL))) {
      errors.push("Stage level must contain only numbers");
    }

    if (!safe(data.DAY_COUNT)) {
      errors.push("Day Count is required");
    } else if (!floatNumber.test(safe(data.DAY_COUNT))) {
      errors.push("Day Count must be a valid number");
    }

    if (!safe(data.PERCENTAGE)) {
      errors.push("Percentage is required");
    } else if (!floatNumber.test(safe(data.PERCENTAGE))) {
      errors.push("Percentage must be a float or integer number");
    }

    if (isUpdate) {
      if (!safe(data.UPDATED_USER)) {
        errors.push("Updated user is required");
      } else if (!alpha.test(safe(data.UPDATED_USER))) {
        errors.push("Updated user must contain only letters");
      }
    } else {
      if (!safe(data.CREATED_USER)) {
        errors.push("Created user is required");
      } else if (!alpha.test(safe(data.CREATED_USER))) {
        errors.push("Created user must contain only letters");
      }
    }

    // Duplicate check only during creation
    if (!isUpdate && existingEntries) {
      const duplicate = existingEntries.some(
        (item) => String(item.STAGE_ID).trim() === safe(data.STAGE_ID)
      );
      if (duplicate) {
        errors.push("A Payment Stage with the same STAGE ID already exists.");
      }
    }

    return errors;
  }

  //exclusion packages validation
  if (ruleName === "exclusionPackages") {
    if (!data.EXP_ID?.toString().trim()) {
      errors.push("EXP ID is required");
    } else if (!digitsOnly.test(data.EXP_ID)) {
      errors.push("EXP ID must contain digits only");
    }

    if (!data.TARIFF_ID?.toString().trim()) {
      errors.push("Tariff ID is required");
    } else if (!alphanum.test(data.TARIFF_ID)) {
      errors.push("Tariff ID must be alphanumeric");
    }

    if (!data.TARIFF_NAME?.toString().trim()) {
      errors.push("Tariff Name is required");
    } else if (!alphanumWithHyphen.test(data.TARIFF_NAME)) {
      errors.push(
        "Tariff Name must contain only letters, numbers, spaces, and hyphens"
      );
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.toString().trim()) {
        errors.push("Updated user is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated user must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.toString().trim()) {
        errors.push("Created user is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created user must contain only letters");
      }
    }

    // Duplicate check (only during creation)
    if (!isUpdate && existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.EXP_ID === data.EXP_ID
      );
      if (duplicate) {
        errors.push("This package with the same EXP ID already exists.");
      }
    }

    return errors;
  }

  // bearer PCR validation
  if (ruleName === "bearerPCR") {
    if (!data.BEARER_PCR_ID?.trim()) {
      errors.push("Bearer PCR ID is required");
    } else if (!digitsOnly.test(data.BEARER_PCR_ID)) {
      errors.push("Bearer PCR ID must contain digits only");
    }

    if (!data.TARIFF_ID?.trim()) {
      errors.push("Tariff ID is required");
    } else if (!digitsOnly.test(data.TARIFF_ID)) {
      errors.push("Tariff ID must contain digits only");
    }

    if (!data.TARIFF_NAME?.trim()) {
      errors.push("Tariff Name is required");
    } else if (!alphanum.test(data.TARIFF_NAME)) {
      errors.push("Tariff Name must contain only letters and numbers");
    }

    if (!data.RENTAL_WO_TAX?.toString().trim()) {
      errors.push("Rental Without Tax is required");
    } else if (!floatNumber.test(data.RENTAL_WO_TAX)) {
      errors.push("Rental Without Tax must be a valid number");
    }

    if (!data.SERVICE_TYPE?.trim()) {
      errors.push("Service Type is required");
    } else if (!alphaWithHyphen.test(data.SERVICE_TYPE)) {
      errors.push(
        "Service Type must contain only letters, spaces, and hyphens"
      );
    }

    if (!data.ORDER_TYPE?.trim()) {
      errors.push("Order Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_TYPE)) {
      errors.push("Order Type must contain only letters, spaces, and hyphens");
    }

    if (!data.ORDER_SUB_TYPE?.trim()) {
      errors.push("Order Sub Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_SUB_TYPE)) {
      errors.push(
        "Order Sub Type must contain only letters, spaces, and hyphens"
      );
    }

    if (!data.SPEED?.trim()) {
      errors.push("Speed is required");
    } else if (!alphanum.test(data.SPEED)) {
      errors.push("Speed must contain only letters and numbers");
    }

    if (!data.WITH_BB_RATE?.toString().trim()) {
      errors.push("With BB Rate is required");
    } else if (!floatNumber.test(data.WITH_BB_RATE)) {
      errors.push("With BB Rate must be a valid number");
    }

    if (!data.WITHOUT_BB_RATE?.toString().trim()) {
      errors.push("Without BB Rate is required");
    } else if (!floatNumber.test(data.WITHOUT_BB_RATE)) {
      errors.push("Without BB Rate must be a valid number");
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated User is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated User must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created User is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created User must contain only letters");
      }
    }

    // Optional: Duplicate check (on creation only)
    if (!isUpdate && existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.BEARER_PCR_ID === data.BEARER_PCR_ID
      );
      if (duplicate) {
        errors.push("A record with the same Bearer PCR ID already exists.");
      }
    }

    return errors;
  }

  // peo packages validations
  if (ruleName === "peoPackages") {
    if (!data.PEO_PCR_ID?.trim()) {
      errors.push("PEO PCR ID is required");
    } else if (!digitsOnly.test(data.PEO_PCR_ID)) {
      errors.push("PEO PCR ID must contain digits only");
    }

    if (!data.TARIFF_ID?.trim()) {
      errors.push("Tariff ID is required");
    } else if (!digitsOnly.test(data.TARIFF_ID)) {
      errors.push("Tariff ID must contain digits only");
    }

    if (!data.TARIFF_NAME?.trim()) {
      errors.push("Tariff Name is required");
    } else if (!alphanum.test(data.TARIFF_NAME)) {
      errors.push("Tariff Name must contain only letters and numbers");
    }

    if (!data.RENTAL_WO_TAX?.toString().trim()) {
      errors.push("Rental Without Tax is required");
    } else if (!floatNumber.test(data.RENTAL_WO_TAX)) {
      errors.push("Rental Without Tax must be a valid number");
    }

    if (!data.SERVICE_TYPE?.trim()) {
      errors.push("Service Type is required");
    } else if (!alphaWithHyphen.test(data.SERVICE_TYPE)) {
      errors.push(
        "Service Type must contain only letters, spaces, and hyphens"
      );
    }

    if (!data.ORDER_TYPE?.trim()) {
      errors.push("Order Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_TYPE)) {
      errors.push("Order Type must contain only letters, spaces, and hyphens");
    }

    if (!data.PCR?.toString().trim()) {
      errors.push("PCR is required");
    } else if (!floatNumber.test(data.PCR)) {
      errors.push("PCR must be a valid number");
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated User is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated User must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created User is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created User must contain only letters");
      }
    }

    // Optional duplicate check
    if (!isUpdate && existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.PEO_PCR_ID === data.PEO_PCR_ID
      );
      if (duplicate) {
        errors.push(
          "A PEO PCR record with the same PEO PCR ID already exists."
        );
      }
    }

    return errors;
  }

  // bb packages validations
  if (ruleName === "BBPackages") {
    if (!data.BB_PCR_ID?.trim()) {
      errors.push("BB PCR ID is required");
    } else if (!digitsOnly.test(data.BB_PCR_ID)) {
      errors.push("BB PCR ID must contain digits only");
    }

    if (!data.TARIFF_ID?.trim()) {
      errors.push("Tariff ID is required");
    } else if (!digitsOnly.test(data.TARIFF_ID)) {
      errors.push("Tariff ID must contain digits only");
    }

    if (!data.TARIFF_NAME?.trim()) {
      errors.push("Tariff Name is required");
    } else if (!alphanum.test(data.TARIFF_NAME)) {
      errors.push("Tariff Name must contain only letters and numbers");
    }

    if (!data.RENTAL_WO_TAX?.toString().trim()) {
      errors.push("Rental Without Tax is required");
    } else if (!floatNumber.test(data.RENTAL_WO_TAX)) {
      errors.push("Rental Without Tax must be a valid number");
    }

    if (!data.PCR?.toString().trim()) {
      errors.push("PCR is required");
    } else if (!floatNumber.test(data.PCR)) {
      errors.push("PCR must be a valid number");
    }

    if (!data.ADDITIONAL_COST?.toString().trim()) {
      errors.push("Additional Cost is required");
    } else if (!floatNumber.test(data.ADDITIONAL_COST)) {
      errors.push("Additional Cost must be a valid number");
    }

    if (!data.SERVICE_TYPE?.trim()) {
      errors.push("Service Type is required");
    } else if (!alphaWithHyphen.test(data.SERVICE_TYPE)) {
      errors.push(
        "Service Type must contain only letters, spaces, and hyphens"
      );
    }

    if (!data.ORDER_TYPE?.trim()) {
      errors.push("Order Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_TYPE)) {
      errors.push("Order Type must contain only letters, spaces, and hyphens");
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated User is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated User must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created User is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created User must contain only letters");
      }
    }

    // Optional Duplicate Check
    if (!isUpdate && existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.BB_PCR_ID === data.BB_PCR_ID
      );
      if (duplicate) {
        errors.push("A BB Package with the same BB PCR ID already exists.");
      }
    }

    return errors;
  }

  // LteBb Packages validations
  if (ruleName === "LteBbPackages") {
    if (!data.TARIFF_ID?.trim()) {
      errors.push("Tariff ID is required");
    } else if (!digitsOnly.test(data.TARIFF_ID)) {
      errors.push("Tariff ID must contain digits only");
    }

    if (!data.TARIFF_NAME?.trim()) {
      errors.push("Tariff Name is required");
    } else if (!alphanum.test(data.TARIFF_NAME)) {
      errors.push("Tariff Name must be alphanumeric only");
    }

    if (!data.SERVICE_TYPE?.trim()) {
      errors.push("Service Type is required");
    } else if (!alphaWithHyphen.test(data.SERVICE_TYPE)) {
      errors.push(
        "Service Type must contain only letters, spaces, and hyphens"
      );
    }

    if (!data.ORDER_TYPE?.trim()) {
      errors.push("Order Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_TYPE)) {
      errors.push("Order Type must contain only letters, spaces, and hyphens");
    }

    if (!data.RENTAL?.toString().trim()) {
      errors.push("Rental is required");
    } else if (!floatNumber.test(data.RENTAL)) {
      errors.push("Rental must be a valid number");
    }

    if (!data.PCR?.toString().trim()) {
      errors.push("PCR is required");
    } else if (!floatNumber.test(data.PCR)) {
      errors.push("PCR must be a valid number");
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated User is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated User must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created User is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created User must contain only letters");
      }
    }

    // Check for duplicate TARIFF_ID only during creation
    if (!isUpdate && existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.TARIFF_ID === data.TARIFF_ID
      );
      if (duplicate) {
        errors.push("A record with the same Tariff ID already exists.");
      }
    }

    return errors;
  }

  // LteBb Package PCR validations
  if (ruleName === "LteBbPackagePCR") {
    if (!data.LTEBB_PCR_ID?.trim()) {
      errors.push("LTE BB PCR ID is required");
    } else if (!digitsOnly.test(data.LTEBB_PCR_ID)) {
      errors.push("LTE BB PCR ID must contain digits only");
    }

    if (!data.TARIFF_ID?.trim()) {
      errors.push("Tariff ID is required");
    } else if (!digitsOnly.test(data.TARIFF_ID)) {
      errors.push("Tariff ID must contain digits only");
    }

    if (!data.TARIFF_NAME?.trim()) {
      errors.push("Tariff Name is required");
    } else if (!alphanum.test(data.TARIFF_NAME)) {
      errors.push("Tariff Name must be alphanumeric");
    }

    if (!data.SERVICE_TYPE?.trim()) {
      errors.push("Service Type is required");
    } else if (!alphaWithHyphen.test(data.SERVICE_TYPE)) {
      errors.push(
        "Service Type must contain only letters, spaces, and hyphens"
      );
    }

    if (!data.ORDER_TYPE?.trim()) {
      errors.push("Order Type is required");
    } else if (!alphaWithHyphen.test(data.ORDER_TYPE)) {
      errors.push("Order Type must contain only letters, spaces, and hyphens");
    }

    if (!data.PREPAID_RATE?.toString().trim()) {
      errors.push("Prepaid Rate is required");
    } else if (!floatNumber.test(data.PREPAID_RATE)) {
      errors.push("Prepaid Rate must be a valid number");
    }

    if (!data.POSTPAID_FULL_PAYMENT_RATE?.toString().trim()) {
      errors.push("Postpaid Full Payment Rate is required");
    } else if (!floatNumber.test(data.POSTPAID_FULL_PAYMENT_RATE)) {
      errors.push("Postpaid Full Payment Rate must be a valid number");
    }

    if (!data.POSTPAID_CONCESSIONARY?.toString().trim()) {
      errors.push("Postpaid Concessionary Rate is required");
    } else if (!floatNumber.test(data.POSTPAID_CONCESSIONARY)) {
      errors.push("Postpaid Concessionary Rate must be a valid number");
    }

    if (!data.PAID_TYPE?.trim()) {
      errors.push("Paid Type is required");
    } else if (!alpha.test(data.PAID_TYPE)) {
      errors.push("Paid Type must contain only letters");
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated User is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated User must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created User is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created User must contain only letters");
      }

      // Duplicate check during creation
      if (existingEntries) {
        const duplicate = existingEntries.some(
          (item) =>
            item.LTEBB_PCR_ID === data.LTEBB_PCR_ID ||
            item.TARIFF_ID === data.TARIFF_ID
        );
        if (duplicate) {
          errors.push(
            "A record with the same LTE BB PCR ID or Tariff ID already exists"
          );
        }
      }
    }

    return errors;
  }

  // unlimited voice packages validations
  if (ruleName === "unlimitedVoice") {
    if (!data.UVOICE_ID?.trim()) {
      errors.push("UVOICE ID is required");
    } else if (!digitsOnly.test(data.UVOICE_ID)) {
      errors.push("UVOICE ID must contain digits only");
    }

    if (!data.TARIFF_ID?.trim()) {
      errors.push("Tariff ID is required");
    } else if (!digitsOnly.test(data.TARIFF_ID)) {
      errors.push("Tariff ID must contain digits only");
    }

    if (!data.TARIFF_NAME?.trim()) {
      errors.push("Tariff Name is required");
    } else if (!alphanum.test(data.TARIFF_NAME)) {
      errors.push("Tariff Name must be alphanumeric");
    }

    if (!data.MEDIUM?.trim()) {
      errors.push("Medium is required");
    } else if (!alpha.test(data.MEDIUM)) {
      errors.push("Medium must contain only letters");
    }

    if (!data.PCR?.toString().trim()) {
      errors.push("PCR is required");
    } else if (!floatNumber.test(data.PCR)) {
      errors.push("PCR must be a valid number");
    }

    if (isUpdate) {
      if (!data.UPDATED_USER?.trim()) {
        errors.push("Updated User is required");
      } else if (!alpha.test(data.UPDATED_USER)) {
        errors.push("Updated User must contain only letters");
      }
    } else {
      if (!data.CREATED_USER?.trim()) {
        errors.push("Created User is required");
      } else if (!alpha.test(data.CREATED_USER)) {
        errors.push("Created User must contain only letters");
      }

      // Duplicate check on create
      if (existingEntries) {
        const duplicate = existingEntries.some(
          (item) =>
            item.UVOICE_ID === data.UVOICE_ID ||
            item.TARIFF_ID === data.TARIFF_ID
        );
        if (duplicate) {
          errors.push(
            "A record with the same UVOICE ID or Tariff ID already exists"
          );
        }
      }
    }

    return errors;
  }
};

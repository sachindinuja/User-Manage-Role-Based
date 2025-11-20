export const validations = (
  data,
  ruleName,
  isUpdate = false
) => {
  const errors = [];

  // Safe string conversion helper


  // Regex definitions
  const alpha = /^[A-Za-z\s]+$/; //" must contain only letters"
  const alphanum = /^[A-Za-z0-9\s]+$/; //" must contain only letters, numbers, and spaces"
  const alphaWithHyphen = /^[A-Za-z\s-]+$/; //" must contain only letters, spaces, and hyphens"
  const alphaWithUnderscore = /^[A-Za-z\s_]+$/; //" must contain only letters, spaces, and underscores"
  const digitsOnly = /^[0-9]+$/; //must contain digits only
  const floatNumber = /^\d+(\.\d{1,2})?$/; // must contain a float number with max 2 decimal places

  if(ruleName === "bearerRates"){
    if (!data.SERVICE_TYPE?.trim()){
        errors.push("Service Type is required");
    } else if (!alpha.test(data.SERVICE_TYPE)){
        errors.push("Service Type must contain only letters");
    }

    if(!data.ORDER_TYPE?.trim()){
        errors.push("Order Type is required");
    } else if (!alpha.test(data.ORDER_TYPE)){
        errors.push("Order Type must contain only letters");
    }

    if(!data.COMPLIANCE?.trim()){
        errors.push("Compliance is required");
    } else if (!alpha.test(data.COMPLIANCE)){
        errors.push("Compliance must contain only letters");
    }

    if(!data.SLAB_1?.trim()){
        errors.push("Slab 1 is required");
    } else if (!floatNumber.test(data.SLAB_1)){
        errors.push("Slab 1 must contain only numbers");
    }

    if(!data.SLAB_2?.trim()){
        errors.push("Slab 2 is required");
    } else if (!floatNumber.test(data.SLAB_2)){
        errors.push("Slab 2 must contain only numbers");
    }

    if(!data.SLAB_3?.trim()){
        errors.push("Slab 3 is required");
    } else if (!floatNumber.test(data.SLAB_3)){
        errors.push("Slab 3 must contain only numbers");
    }

    if(!data.SLAB_4?.trim()){
        errors.push("Slab 4 is required");
    } else if (!floatNumber.test(data.SLAB_4)){
        errors.push("Slab 4 must contain only numbers");
    }

    if(!data.SLAB_5?.trim()){
        errors.push("Slab 5 is required");
    } else if (!floatNumber.test(data.SLAB_5)){
        errors.push("Slab 5 must contain only numbers");
    }

    if(!data.SLAB_6?.trim()){
        errors.push("Slab 6 is required");
    } else if (!floatNumber.test(data.SLAB_6)){
        errors.push("Slab 6 must contain only numbers");
    }

    if (isUpdate){
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

    /*if (existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.SLAB_ID === data.SLAB_ID
      );

      if (duplicate) {
        errors.push("This SLAB with the same SLAB ID already exists.");
      }
    }*/

    return errors;
  }

  if (ruleName === "blackList"){
    if(!data.PACKAGE_NAME?.trim()){
        errors.push("Package Name is required");
    } else if (!alphaWithHyphen.test(data.PACKAGE_NAME)){
        errors.push("Package Name must contain only letters and hyphen");
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
    
    /*if (existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.SLAB_ID === data.SLAB_ID
      );

      if (duplicate) {
        errors.push("This SLAB with the same SLAB ID already exists.");
      }
    }*/

    return errors;
  }

  if (ruleName === "packageRate"){
    if(!data.PACKAGE_NAME?.trim()){
        errors.push("Package Name is required");
    } else if (!alphanum.test(data.PACKAGE_NAME)){
        errors.push("Package Name must contain only letters and numbers");
    }

    if(!data.COMPLIANCE?.trim()){
        errors.push("Compliance is required");
    } else if (!alpha.test(data.COMPLIANCE)){
        errors.push("Compliance must contain only letters");
    }

    if(!data.STAGE_LEVEL_STATUS_CHECK?.trim()){
        errors.push("Stage Level status check is required");
    } else if (!alpha.test(data.STAGE_LEVEL_STATUS_CHECK)){
        errors.push("Stage Level status check must contain only letters");
    }

    if(!data.SLAB_LEVEL_1_RATE?.trim()){
        errors.push("Slab level 1 rate is required");
    } else if (!floatNumber.test(data.SLAB_LEVEL_1_RATE)){
        errors.push("Slab level 1 rate must contain only numbers");
    }

    if(!data.BASE_RATE?.trim()){
        errors.push("Base rate is required");
    } else if (!floatNumber.test(data.BASE_RATE)){
        errors.push("Base rate must contain only numbers");
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
    
    /*if (existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.SLAB_ID === data.SLAB_ID
      );

      if (duplicate) {
        errors.push("This SLAB with the same SLAB ID already exists.");
      }
    }*/

    return errors;
    
  }

  if (ruleName === "serviceOrderType"){
    if(!data.PRODUCT?.trim()){
        errors.push("Product is required");
    } else if (!alpha.test(data.PRODUCT)){
        errors.push("Product must contain only letters");
    }

    if(!data.SERVICE_TYPE?.trim()){
        errors.push("Service Type is required");
    } else if (!alpha.test(data.SERVICE_TYPE)){
        errors.push("Service Type must contain only letters");
    }

    if(!data.ORDER_TYPE?.trim()){
        errors.push("Order Type is required");
    } else if (!alpha.test(data.ORDER_TYPE)){
        errors.push("Order Type must contain only letters");
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
    
    /*if (existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.SLAB_ID === data.SLAB_ID
      );

      if (duplicate) {
        errors.push("This SLAB with the same SLAB ID already exists.");
      }
    }*/

    return errors;
  }

  if (ruleName === "slabDemarcation"){
    if(!data.SLAB_LEVEL?.trim()){
        errors.push("Slab Level is required");
    } else if (!alphanum.test(data.SLAB_LEVEL)){
        errors.push("Slab Level must contain only letters and numbers");
    }

    if(!data.UPPER_RANGE?.trim()){
        errors.push("Upper range is required");
    } else if (!floatNumber.test(data.UPPER_RANGE)){
        errors.push("upper range must contain only numbers");
    }

    if(!data.LOWER_RANGE?.trim()){
        errors.push("Lower range is required");
    } else if (!floatNumber.test(data.LOWER_RANGE)){
        errors.push("Lower range must contain only numbers");
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
    
    /*if (existingEntries) {
      const duplicate = existingEntries.some(
        (item) => item.SLAB_ID === data.SLAB_ID
      );

      if (duplicate) {
        errors.push("This SLAB with the same SLAB ID already exists.");
      }
    }*/

    return errors;
  }

}


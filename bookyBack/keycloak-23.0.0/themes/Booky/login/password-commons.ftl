<#macro logoutOtherSessions>
    <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
        <div class="${properties.kcFormOptionsWrapperClass!}">
            <div class="checkbox">
                <label class="kc-checkbox-label">
                    <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" checked>
                    ${msg("logoutOtherSessions")}
                </label>
            </div>
        </div>
    </div>
</#macro>

<style>
    /* Checkbox styling */
    .kc-checkbox-label {
        display: flex;
        align-items: center;
        font-size: 1rem;
        color: #333;
    }

    .kc-checkbox-label input[type="checkbox"] {
        margin-right: 10px;
        transform: scale(1.2);
        cursor: pointer;
    }

    /* Styling for form options container */
    .${properties.kcFormOptionsClass!} {
        margin-bottom: 20px;
    }

    /* Wrapper class for options */
    .${properties.kcFormOptionsWrapperClass!} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .checkbox {
        display: flex;
        align-items: center;
    }
</style>

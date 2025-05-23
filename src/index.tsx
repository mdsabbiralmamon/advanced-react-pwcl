import React, { useMemo, useEffect } from "react"

interface CustomIconComponents {
	ValidIcon: React.ReactNode
	InvalidIcon: React.ReactNode
}
interface PasswordProps {
	value: string
	valueAgain?: string
	minLength?: number
	maxLength?: number
	iconSize?: number
	validColor?: string
	invalidColor?: string
	validTextColor?: string
	invalidTextColor?: string
	onChange?: (isValid: boolean, failedRules: RuleNames[]) => any
	messages?: {
		[key in RuleNames]?: string
	}
	iconComponents?: CustomIconComponents
	messageOnlyColor?: string
	messageOnlyPrefix?: string
}
export type RuleNames =
	| "minLength"
	| "maxLength"
	| "specialChar"
	| "number"
	| "capital"
	| "match"
	| "lowercase"
	| "letter"
	| "notEmpty"
	| "capitalAndLowercase"
	| "noSpaces"

export interface PasswordCheckListProps extends PasswordProps {
	className?: string
	style?: React.CSSProperties
	rules: Array<RuleNames>
	rtl?: boolean
	hideIcon?: boolean
	specialCharsRegex?: RegExp
	itemClassName?: string
	renderAsMessagesOnly?: boolean
}

const valueHasCapitalCharacters = (value: string) => {
	for (let i = 0; i < value.length; i++) {
		const c = value[i]
		if (c !== c.toLowerCase() && c === c.toUpperCase()) return true
	}
	return false
}

const valueHasLowercaseCharacters = (value: string) => {
	for (let i = 0; i < value.length; i++) {
		const c = value[i]
		if (c !== c.toUpperCase() && c === c.toLowerCase()) return true
	}
	return false
}

const PasswordCheckList: React.FC<PasswordCheckListProps> = ({
	className,
	style,
	rules,
	value,
	valueAgain,
	minLength = 6,
	maxLength = 32,
	rtl,
	onChange,
	specialCharsRegex = /[~`¿¡!#$%\^&*€£@+÷=\-\[\]\\';,/{}\(\)|\\":<>\?\.\_]/g,
	messages = {},
	renderAsMessagesOnly,
	messageOnlyColor = "red",
	messageOnlyPrefix = "New password must contain at least:",
	...remainingProps
}) => {
	const ruleDefinitions: { [key in RuleNames]: { valid: boolean; message: string } } = {
		minLength: {
			valid: value.length >= minLength,
			message: messages.minLength || `Minimum ${minLength} characters`,
		},
		specialChar: {
			valid: specialCharsRegex.test(value),
			message: messages.specialChar || "A special character",
		},
		number: {
			valid: /\d/.test(value),
			message: messages.number || "A number",
		},
		match: {
			valid: value.length > 0 && value === valueAgain,
			message: messages.match || "Passwords must be matched.",
		},
		capital: {
			valid: valueHasCapitalCharacters(value),
			message: messages.capital || "A capital letter",
		},
		lowercase: {
			valid: valueHasLowercaseCharacters(value),
			message: messages.lowercase || "A lowercase letter",
		},
		capitalAndLowercase: {
			valid: valueHasCapitalCharacters(value) && valueHasLowercaseCharacters(value),
			message: messages.capitalAndLowercase || "An uppercase and a lowercase letter",
		},
		letter: {
			valid: /[a-zA-Z]/.test(value),
			message: messages.letter || "A letter",
		},
		maxLength: {
			valid: value.length <= maxLength,
			message: messages.maxLength || `No more than ${maxLength} characters`,
		},
		notEmpty: {
			valid: Boolean(value.length > 0 && valueAgain && valueAgain.length > 0),
			message: messages.notEmpty || "Fields cannot be empty",
		},
		noSpaces: {
			valid: Boolean(value.length > 0 && !/\s/.test(value)),
			message: messages.noSpaces || "No spaces",
		},
	}

	const enabledRules = useMemo(
		() => rules.filter((rule) => Boolean(ruleDefinitions[rule])),
		[rules]
	)

	const isValid = enabledRules.every((rule) => ruleDefinitions[rule].valid)

	const failedRules = useMemo(
		() => enabledRules.filter((rule) => !ruleDefinitions[rule].valid),
		[value, valueAgain, enabledRules]
	)

	useEffect(() => {
		if (typeof onChange === "function") {
			onChange(isValid, failedRules)
		}
	}, [isValid, failedRules])

	if (rtl) {
		className = className ? className + " rtl" : "rtl"
	}

	if (renderAsMessagesOnly) {
		if (enabledRules.includes("match") && failedRules.includes("match")) {
			return (
				<RenderShortMessage
					className={className}
					style={style}
					messageOnlyColor={messageOnlyColor}
				>
					{ruleDefinitions["match"].message}
				</RenderShortMessage>
			);
		}

		const errorText = failedRules.map((rule) => ruleDefinitions[rule].message).join(", ");

		return (
			<RenderShortMessage
				className={className}
				style={style}
				messageOnlyColor={messageOnlyColor}
			>
				{failedRules.length > 0 ? `${messageOnlyPrefix} ${errorText}` : null}
			</RenderShortMessage>
		);
	}

	return (
		<ul
			className={className}
			style={{
				margin: 0,
				padding: 0,
				...style,
			}}
		>
			{enabledRules.map((rule) => {
				const { message, valid } = ruleDefinitions[rule]
				return (
					<Rule
						key={rule}
						valid={valid}
						iconSize={18}
						validColor="#4BCA81"
						invalidColor="#FF0033"
						rtl={rtl}
						{...remainingProps}
					>
						{message}
					</Rule>
				)
			})}
		</ul>
	)
}

interface RuleProps {
	valid: boolean
	iconSize?: number
	iconComponents?: CustomIconComponents
	validColor?: string
	invalidColor?: string
	validTextColor?: string
	invalidTextColor?: string
	rtl?: boolean
	hideIcon?: boolean
	children?: React.ReactNode
	itemClassName?: string
}

const Rule: React.FC<RuleProps> = ({
	valid,
	iconSize,
	validColor,
	invalidColor,
	validTextColor,
	invalidTextColor,
	iconComponents,
	hideIcon,
	rtl,
	children,
	itemClassName,
}) => {
	return (
		<li
			className={`${itemClassName} ${valid ? "valid" : "invalid"}`}
			style={{
				listStyleType: "none",
				display: "flex",
				alignItems: "center",
				margin: "2px 0",
			}}
		>
			{!hideIcon &&
				(iconComponents ? (
					valid ? (
						iconComponents.ValidIcon
					) : (
						iconComponents.InvalidIcon
					)
				) : (
					<svg
						className="checklist-icon"
						width={iconSize}
						height={iconSize}
						viewBox="0 0 512 512"
						style={{ marginRight: rtl ? 0 : 5, marginLeft: rtl ? 5 : 0 }}
					>
						<path
							fill={valid ? validColor : invalidColor}
							d={
								valid
									? "M432 64l-240 240-112-112-80 80 192 192 320-320z"
									: "M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"
							}
						/>
					</svg>
				))}
			<span
				style={{
					paddingTop: 2,
					opacity: valid ? 1 : !invalidTextColor ? 0.5 : undefined,
					flex: 1,
					color: valid ? validTextColor : invalidTextColor,
				}}
			>
				{children}
			</span>
		</li>
	)
}

export const RenderShortMessage: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  messageOnlyColor: string;
  children: React.ReactNode;
}> = ({ className, style, messageOnlyColor, children }) => {
  return (
    <div
      className={className}
      style={{
        color: messageOnlyColor,
        fontSize: "0.85rem",
        padding: "4px 0",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PasswordCheckList
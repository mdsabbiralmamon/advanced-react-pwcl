import React from "react"
import { mount } from "enzyme"

import PasswordCheckList, { RenderShortMessage } from "./index"

describe("PasswordCheckList Test Suite", () => {
    // New tests for RenderShortMessage component
    describe("RenderShortMessage", () => {
        it("renders message with correct styles", () => {
            const result = mount(
                <RenderShortMessage
                    className="test-class"
                    style={{ marginTop: '5px' }}
                    messageOnlyColor="red"
                >
                    Test error message
                </RenderShortMessage>
            )
            
            expect(result.find('div').hasClass('test-class')).toBeTruthy()
            expect(result.find('div').props().style?.color).toEqual('red')
            expect(result.find('div').props().style?.fontSize).toEqual('0.85rem')
            expect(result.find('div').props().style?.padding).toEqual('4px 0')
            expect(result.find('div').props().style?.marginTop).toEqual('5px')
            expect(result.text()).toEqual('Test error message')
        })
        
        it("merges custom styles with default styles", () => {
            const result = mount(
                <RenderShortMessage
                    messageOnlyColor="blue"
                    style={{ fontWeight: 'bold' }}
                >
                    Message
                </RenderShortMessage>
            )
            
            const styles = result.find('div').props().style
            expect(styles?.color).toEqual('blue')
            expect(styles?.fontSize).toEqual('0.85rem')
            expect(styles?.padding).toEqual('4px 0')
            expect(styles?.fontWeight).toEqual('bold')
        })
    })
    
    // Tests for renderAsMessagesOnly mode
    describe("renderAsMessagesOnly", () => {
        it("renders password match message when match rule fails", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["match"]}
                    value="password"
                    valueAgain="different"
                    renderAsMessagesOnly={true}
                    messageOnlyColor="red"
                />
            )
            
            expect(result.find(RenderShortMessage).exists()).toBeTruthy()
            expect(result.text()).toContain("Passwords must be matched.")
        })
        
        it("renders multiple error messages for failed rules", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["minLength", "number"]}
                    value="abc"
                    minLength={6}
                    renderAsMessagesOnly={true}
                    messageOnlyPrefix="Password requirements:"
                    messageOnlyColor="red"
                />
            )
            
            expect(result.find(RenderShortMessage).exists()).toBeTruthy()
            expect(result.text()).toContain("Password requirements:")
            expect(result.text()).toContain("Minimum 6 characters")
            expect(result.text()).toContain("A number")
        })
        
        it("renders nothing when all rules pass in message-only mode", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["minLength"]}
                    value="password123"
                    minLength={6}
                    renderAsMessagesOnly={true}
                />
            )
            
            expect(result.text()).toEqual("")
        })
        
        it("passes className and style props to RenderShortMessage", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["minLength"]}
                    value="123"
                    minLength={6}
                    renderAsMessagesOnly={true}
                    className="custom-class"
                    style={{ margin: '10px' }}
                    messageOnlyColor="orange"
                />
            )
            
            expect(result.find(RenderShortMessage).props().className).toEqual("custom-class")
            expect(result.find(RenderShortMessage).props().style).toEqual({ margin: '10px' })
            expect(result.find(RenderShortMessage).props().messageOnlyColor).toEqual("orange")
        })
    })
    
    // Existing tests
    it("calls onChange when items are valid", () => {
        const onChange = jest.fn()
        mount(
            <PasswordCheckList
                rules={["minLength"]}
                minLength={6}
                value="123456"
                onChange={onChange}
            />,
        )
        expect(onChange).toHaveBeenCalledWith(true, [])
    })
    
    it("calls onChange when items are invalid with the failing rules", () => {
        const onChange = jest.fn()
        mount(
            <PasswordCheckList
                rules={["minLength", "specialChar", "number"]}
                minLength={6}
                value="12345"
                onChange={onChange}
            />,
        )
        expect(onChange).toHaveBeenCalledWith(false, ["minLength", "specialChar"])
    })
    
    it("calls onChange when a rule changes from invalid to valid", () => {
        const onChange = jest.fn()
        const result = mount(
            <PasswordCheckList
                rules={["minLength", "specialChar", "number"]}
                minLength={6}
                value="12345"
                onChange={onChange}
            />,
        )
        expect(onChange).toHaveBeenCalledWith(false, ["minLength", "specialChar"])
        result.setProps({ value: "123456" })
        expect(onChange).toHaveBeenCalledWith(false, ["specialChar"])
    })
    
    it("sets rtl className when `rtl` prop is set", () => {
        const result = mount(
            <PasswordCheckList rules={["minLength"]} minLength={6} value="123456" rtl />,
        )
        expect(result.find("ul").hasClass("rtl")).toBeTruthy()
    })
    
    it("adds rtl className to additional classes when `rtl` prop is set", () => {
        const result = mount(
            <PasswordCheckList
                className="test"
                rules={["minLength"]}
                minLength={6}
                value="123456"
                rtl
            />,
        )
        expect(result.find("ul").hasClass("test rtl")).toBeTruthy()
    })
    
    it("hides the icons when hideIcon prop is true", () => {
        const result = mount(
            <PasswordCheckList rules={["minLength"]} minLength={6} value="123456" hideIcon />,
        )
        expect(result.find("svg").exists()).toBeFalsy()
    })
    
    it("shows the icons when hideIcon prop is false", () => {
        const result = mount(
            <PasswordCheckList
                rules={["minLength"]}
                minLength={6}
                value="123456"
                hideIcon={false}
            />,
        )
        expect(result.find("svg").exists()).toBeTruthy()
    })
    
    it("uses the validTextColor prop when valid", () => {
        const result = mount(
            <PasswordCheckList
                rules={["minLength"]}
                minLength={6}
                value="123456"
                validTextColor="green"
            />,
        )
        expect(result.find("span").props().style?.color).toEqual("green")
    })
    
    it("uses the invalidTextColor prop when invalid", () => {
        const result = mount(
            <PasswordCheckList
                rules={["minLength"]}
                minLength={6}
                value="12345"
                invalidTextColor="red"
            />,
        )
        expect(result.find("span").props().style?.color).toEqual("red")
        expect(result.find("span").props().style?.opacity).toEqual(undefined)
    })
    
    it("gracefully handles if text colors are not defined", () => {
        const result = mount(
            <PasswordCheckList rules={["minLength"]} minLength={8} value="123456" />,
        )
        expect(result.find("span").props().style?.color).toEqual(undefined)
        expect(result.find("span").props().style?.opacity).toEqual(0.5)
    })
    
    describe("iconComponents", () => {
        it("has the default icons", () => {
            const result = mount(
                <PasswordCheckList rules={["minLength"]} minLength={6} value="123456" />,
            )
            expect(result.find("svg").hasClass("checklist-icon")).toBeTruthy()
        })
        it("allows for customized icons", () => {
            const validTest = mount(
                <PasswordCheckList
                    rules={["minLength"]}
                    minLength={6}
                    value="123456"
                    iconComponents={{
                        ValidIcon: <div>I'm Valid</div>,
                        InvalidIcon: <div>I'm Invalid</div>,
                    }}
                />,
            )
            expect(validTest.find("li > div").text()).toEqual("I'm Valid")
            const invalidTest = mount(
                <PasswordCheckList
                    rules={["minLength"]}
                    minLength={6}
                    value="12345"
                    iconComponents={{
                        ValidIcon: <div>I'm Valid</div>,
                        InvalidIcon: <div>I'm Invalid</div>,
                    }}
                />,
            )
            expect(invalidTest.find("li > div").text()).toEqual("I'm Invalid")
        })
    })
    
    describe("minLength", () => {
        it("Displays the default minLength message", () => {
            const result = mount(<PasswordCheckList rules={["minLength"]} minLength={6} value="" />)
            expect(result.find("span").text()).toEqual("Minimum 6 characters")
        })
        it("Sets invalid", () => {
            const result = mount(
                <PasswordCheckList rules={["minLength"]} minLength={6} value="12345" />,
            )
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid", () => {
            const result = mount(
                <PasswordCheckList rules={["minLength"]} minLength={6} value="123456" />,
            )
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("maxLength", () => {
        it("Displays the default maxLength message", () => {
            const result = mount(<PasswordCheckList rules={["maxLength"]} maxLength={16} value="" />)
            expect(result.find("span").text()).toEqual("No more than 16 characters")
        })
        it("Sets invalid", () => {
            const result = mount(
                <PasswordCheckList rules={["maxLength"]} maxLength={16} value="12345678123456789" />,
            )
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid", () => {
            const result = mount(
                <PasswordCheckList rules={["maxLength"]} maxLength={16} value="1234567812345678" />,
            )
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("specialChar", () => {
        it("Displays the default specialChar message", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="" />)
            expect(result.find("span").text()).toEqual("A special character")
        })
        it("Sets invalid", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid with !", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="!" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with @", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="@" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with .", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="." />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with _", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="_" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with ¿", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="¿" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with ¡", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="¡" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with ÷", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="÷" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with €", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="€" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with £", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="£" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with (", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value="(" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with )", () => {
            const result = mount(<PasswordCheckList rules={["specialChar"]} value=")" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Allows for a custom set of specialCharacters regular expression", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["specialChar"]}
                    value="1234567812345678"
                    specialCharsRegex={/[\s\S]/g}
                />,
            )
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Allows for a custom set of specialCharacters regular expression that fails", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["specialChar"]}
                    value="1234567812345678"
                    specialCharsRegex={/[\s]/g}
                />,
            )
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
    })
    
    describe("capital", () => {
        it("Displays the default capital message", () => {
            const result = mount(<PasswordCheckList rules={["capital"]} value="" />)
            expect(result.find("span").text()).toEqual("A capital letter")
        })
        it("Sets invalid", () => {
            const result = mount(<PasswordCheckList rules={["capital"]} value="as;lkj23408" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid", () => {
            const result = mount(<PasswordCheckList rules={["capital"]} value="s;lKj23408" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("lowercase", () => {
        it("Displays the default lowercase message", () => {
            const result = mount(<PasswordCheckList rules={["lowercase"]} value="" />)
            expect(result.find("span").text()).toEqual("A lowercase letter")
        })
        it("Sets invalid", () => {
            const result = mount(
                <PasswordCheckList rules={["lowercase"]} value="I'M ALL CAPITALS 1234" />,
            )
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid", () => {
            const result = mount(
                <PasswordCheckList rules={["lowercase"]} value="I HAVE a LOWERCASE LETTER 1234" />,
            )
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("noSpaces", () => {
        it("Displays the default no space message", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value="" />)
            expect(result.find("span").text()).toEqual("No spaces")
        })
        it("Sets valid", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value="Idonthavespaces" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets invalid for an empty value", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value="" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets invalid for space (' ') ", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value="I have spaces" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets invalid for tab space character (\t)", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value={`ihave\tatabspace`} />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets invalid for new line character (\n)", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value={`Ihave\nanewline`} />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets invalid for carriage return character (\r)", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value={`Ihaveacarriage\rreturn`} />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets invalid for form feed character (\f)", () => {
            const result = mount(<PasswordCheckList rules={["noSpaces"]} value={`Ihavea\fformfeed`} />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
    })
    
    describe("capitalAndLowercase", () => {
        it("Displays the default capitalAndLowercase message", () => {
            const result = mount(<PasswordCheckList rules={["capitalAndLowercase"]} value="" />)
            expect(result.find("span").text()).toEqual(
                "An uppercase and a lowercase letter",
            )
        })
        it("Sets invalid", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["capitalAndLowercase"]}
                    value="i have only lowercase letters"
                />,
            )
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["capitalAndLowercase"]}
                    value="I have only lowercase and CAPITAL letters"
                />,
            )
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("letter", () => {
        it("Displays the default letter message", () => {
            const result = mount(<PasswordCheckList rules={["letter"]} value="" />)
            expect(result.find("span").text()).toEqual("A letter")
        })
        it("Sets invalid", () => {
            const result = mount(<PasswordCheckList rules={["letter"]} value="1234" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid with lowercase", () => {
            const result = mount(<PasswordCheckList rules={["letter"]} value="i have a letter" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
        it("Sets valid with capital", () => {
            const result = mount(<PasswordCheckList rules={["letter"]} value="I HAVE A LETTER" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("notEmpty", () => {
        it("Displays the default notEmpty message", () => {
            const result = mount(<PasswordCheckList rules={["notEmpty"]} value="" />)
            expect(result.find("span").text()).toEqual("Fields cannot be empty")
        })
        it("Sets invalid", () => {
            const result = mount(<PasswordCheckList rules={["notEmpty"]} value="" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()

            const againResult = mount(
                <PasswordCheckList rules={["notEmpty"]} value="1" valueAgain="" />,
            )
            expect(againResult.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid", () => {
            const result = mount(<PasswordCheckList rules={["notEmpty"]} value="0" valueAgain="1" />)
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("match", () => {
        it("Displays the default match message", () => {
            const result = mount(
                <PasswordCheckList rules={["match"]} value="test" valueAgain="test" />,
            )
            expect(result.find("span").text()).toEqual("Passwords must be matched.")
        })
        it("Sets invalid when empty", () => {
            const result = mount(<PasswordCheckList rules={["match"]} value="" valueAgain="" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets invalid when non-matching", () => {
            const result = mount(<PasswordCheckList rules={["match"]} value="1" valueAgain="2" />)
            expect(result.find("li").hasClass("invalid")).toBeTruthy()
        })
        it("Sets valid", () => {
            const result = mount(
                <PasswordCheckList rules={["match"]} value="test" valueAgain="test" />,
            )
            expect(result.find("li").hasClass("valid")).toBeTruthy()
        })
    })
    
    describe("messages", () => {
        it("Displays a custom minLength message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["minLength"]}
                    value="test"
                    valueAgain="test"
                    messages={{ minLength: "Custom minLength Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom minLength Message")
        })
        it("Displays a custom specialChar message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["specialChar"]}
                    value="test"
                    valueAgain="test"
                    messages={{ specialChar: "Custom specialChar Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom specialChar Message")
        })
        it("Displays a custom number message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["number"]}
                    value="test"
                    valueAgain="test"
                    messages={{ number: "Custom number Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom number Message")
        })
        it("Displays a custom capital message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["capital"]}
                    value="test"
                    valueAgain="test"
                    messages={{ capital: "Custom capital Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom capital Message")
        })
        it("Displays a custom match message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["match"]}
                    value="test"
                    valueAgain="test"
                    messages={{ match: "Custom match Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom match Message")
        })
        it("Displays a custom notEmpty message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["notEmpty"]}
                    value="test"
                    valueAgain="test"
                    messages={{ notEmpty: "Custom notEmpty Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom notEmpty Message")
        })
        it("Displays a custom maxLength message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["maxLength"]}
                    value="test"
                    valueAgain="test"
                    messages={{ maxLength: "Custom maxLength Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom maxLength Message")
        })
        it("Displays a custom lowercase message", () => {
            const result = mount(
                <PasswordCheckList
                    rules={["lowercase"]}
                    value="test"
                    valueAgain="test"
                    messages={{ lowercase: "Custom lowercase Message" }}
                />,
            )
            expect(result.find("span").text()).toEqual("Custom lowercase Message")
        })
    })
})